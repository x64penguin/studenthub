import datetime
import json
import uuid
import os
import utils
from app import app, db
from flask import request, send_file
from models import get_user, User, UserSession, Test, TestSolution, TESTS_PATH
from authorization import get_current_user, login_required, login_user, logout_user


@app.route("/api/validate_username", methods=["POST"])
def validate_username():
    data = request.json

    return {"response": len(data['username']) != 0 and get_user(data["username"]) is None}, 200


@app.route("/api/load_user")
def load_user():
    user = get_current_user()

    if user is None:
        return {
            "user": {},
            "auth": False
        }, 200

    return {
        "user": user.json_safe(),
        "auth": True
    }, 200


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    user = get_user(data["username"])

    if user is None or not user.check_password(data["password"]):
        return {"response": "Неверное имя пользователя или пароль"}, 200
    else:
        token, expires = login_user(user)
        return {
            "response": "success",
            "token": token,
            "expires": expires,
            "user": user.json_safe(),
        }, 200


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.json

    if get_user(data["username"]) is not None:
        return {"error": "Имя пользователя уже занято"}, 200
    
    user = User(username=data["username"], email=data["email"], account_type=data["account-type"], name=data["name"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return {"response": "success"}, 200


@app.route("/api/logout")
@login_required
def api_logout(user):
    logout_user(user)
    return {"response": "success"}, 200


@app.route("/api/user/<int:uid>")
def api_find_user(uid):
    current_user = get_current_user()
    user = get_user(uid)

    if user is None:
        return {"response": "404"}, 404

    return {
        "response": "success", 
        "user": user.json_safe() if user == current_user else user.json()
    }


@app.route("/static/avatar/<int:uid>")
def api_get_avatar(uid):
    user = User.query.filter_by(id=uid).first()
    default_path = os.path.join(app.config["AVATAR_FOLDER"], "default.svg")

    if user is None:
        return send_file(default_path)

    try:
        return send_file(os.path.join(app.config["AVATAR_FOLDER"], str(user.id) + ".png"))
    except FileNotFoundError:
        return send_file(default_path)


@app.route("/api/edit_profile/<int:uid>", methods=["POST"])
@login_required
def api_edit_profile(current_user, uid):
    if current_user.id != uid:
        return {"response": "unauthorized"}, 401

    current_user.email = request.form["email"]
    
    try:
        avatar_file = request.files["avatar"]
        resized = utils.crop_and_resize(avatar_file)
        avatar_path = os.path.join(app.config["AVATAR_FOLDER"], str(uid) + ".png")
        resized.save(avatar_path, "png")
    except KeyError:
        ...  # avatar not changed

    db.session.commit()

    return {"response": "success"}, 200


@app.route("/api/logout_ip/<string:ip>")
@login_required
def api_logout_ip(_, ip):
    user_session = UserSession.query.filter_by(ip=ip).first()

    if user_session is None:
        return {"response": "unauthorized"}, 401

    db.session.delete(user_session)
    db.session.commit()

    return {"response": "success"}, 200


@app.route("/api/create_test", methods=["POST"])
@login_required
def api_create_test(user):
    data = request.form
    test = Test(name=data["name"], description=data["description"], author_id=user.id)
    image = request.files.get("avatar")
    if image:
        img = utils.crop_and_resize(image)
        img.save(os.path.join(TESTS_PATH, str(test.id) + ".png"))
    db.session.add(test)
    db.session.commit()

    return {
        "response": "success",
        "test": test.id
    }


@app.route("/static/test_icon/<int:tid>")
def test_icon(tid):
    test = Test.query.filter_by(id=tid).first()

    if test is None:
        return {"response": 404}, 404

    try:
        return send_file(os.path.join(TESTS_PATH, str(test.id) + ".png"))
    except FileNotFoundError:
        return send_file(os.path.join(TESTS_PATH, ".default.svg"))


@app.route("/api/test/<int:test_id>")
def get_test(test_id):
    test: Test = Test.query.filter_by(id=test_id).first()
    current_user = get_current_user()

    if test is None:
        return {"response": 404}, 404

    if current_user is not None:
        if current_user.id == test.author_id and request.args.get("include_tasks") == "true":
            return test.safe_json(), 200
        else:
            result = test.json()
            result["solutions"] = list(map(TestSolution.json, TestSolution.query.filter_by(user_id=current_user.id, test_id=test_id).all()))
            return result, 200

    return test.json(), 200


@app.route("/api/edit_test/<int:test_id>", methods=["POST"])
@login_required
def edit_test(user, test_id):
    test = Test.query.filter_by(id=test_id).first()
    if test is None:
        return {"response", 404}, 404

    if user.id != test.author_id:
        return {"response", "unauthorized"}, 401

    test.name = request.form.get("name")
    test.description = request.form.get("description")

    db.session.commit()

    if len(request.files) != 0:
        image = request.files.get("image")
        cropped = utils.crop_and_resize(image)
        cropped.save(os.path.join(TESTS_PATH, str(test.id) + ".png"))

    return {"response": "success"}, 200


@app.route("/api/upload_tasks/<int:test_id>", methods=["POST"])
@login_required
def upload_tasks(user, test_id):
    test = Test.query.filter_by(id=test_id).first()
    if test is None:
        return {"response": 404}, 404

    if user.id != test.author_id:
        return {"response", "unauthorized"}, 401

    with open(os.path.join(TESTS_PATH, str(test.id) + ".json"), "w", encoding="utf8") as file:
        file.write(str(request.data))

    return {"response": "success"}, 200


@app.route("/api/start_test/<int:test_id>")
@login_required
def start_test(user, test_id):
    find_solution = TestSolution.query.filter_by(user_id=user.id, in_progress=True).first()

    if find_solution is not None:
        return {
            "response": "already started",
            "name": find_solution.test.name,
            "id": find_solution.id
        }, 200

    new_solution = TestSolution(user_id=user.id, in_progress=True, test_id=test_id, start_time=datetime.datetime.now())
    db.session.add(new_solution)
    db.session.commit()

    solution_file = open(os.path.join(TESTS_PATH, "solutions", str(new_solution.id) + ".json"), "w")
    solution_file.write(json.dumps({
        "test": test_id,
        "state": "running",
        "skipped": [],
        "answered": {},
        "result": 0,
    }))
    solution_file.close()

    return {
        "response": "started",
        "id": new_solution.id
    }, 200


@app.route("/api/solution/<int:solution_id>")
@login_required
def get_solution(user, solution_id):
    solution = TestSolution.query.filter_by(id=solution_id).first()

    if solution.user_id != user.id:
        return {"response": "unauthorized"}, 401

    return utils.get_solution(solution), 200


@app.route("/api/submit_solution/<int:solution_id>", methods=["POST"])
@login_required
def submit_solution(user, solution_id):
    solution = TestSolution.query.filter_by(id=solution_id).first()

    if solution.user_id != user.id:
        return {
            "response": "unauthorized",
        }, 401

    if not solution.in_progress:
        return {"response": "ended"}, 403

    with open(os.path.join(TESTS_PATH, "solutions", str(solution.id) + ".json"), "r") as f:
        solution_json = json.loads(f.read())

    submitted_task = request.json

    if submitted_task.get("skip"):
        solution_json["skipped"].append(submitted_task["id"])
    else:
        solution_json["answered"][str(submitted_task["id"])] = submitted_task["answer"]
        try:
            solution_json["skipped"].remove(submitted_task["id"])
        except ValueError:
            ...  # don't do anything

    with open(os.path.join(TESTS_PATH, str(solution.test_id) + ".json"), "r") as f:
        test = json.load(f)

    if len(solution_json["answered"]) == len(test):
        if solution_json["state"] == "running" and len(solution_json["skipped"]):
            solution_json["state"] = "running skipped"
        else:
            solution.in_progress = False
            solution.end_time = datetime.datetime.now()
            db.session.commit()
            points, max_points, errors = utils.generate_results(test, solution_json["answered"])
            solution_json["state"] = "complete"
            solution_json["result"] = [points, max_points]
            solution_json["errors"] = errors

    return utils.get_solution(solution, solution_json, True, test)


@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response
