import datetime
import json
import uuid

from app import app, db
import os
import utils
from flask import request, send_file, Response
from models import get_user, User, UserSession, Test, TestSolution
from authorization import get_current_user, login_required, login_user, logout_user
from shtest import TESTS_PATH


@app.route("/api/validate_username", methods=["POST"])
def api_api_validate_username():
    data = request.json

    return {"response": len(data['username']) != 0 and get_user(data["username"]) is None}, 200


@app.route("/api/load_user")
def api_load_user():
    user = get_current_user()

    if user is None:
        return {
            "user": {},
            "auth": False
        }, 200
    else:
        return {
            "user": user.json_safe(),
            "auth": True
        }, 200


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    user = get_user(data["username"])

    if user is None or not user.check_password(data["password"]):
        return {"response": "Неверное имя пользователся или пароль"}, 200
    else:
        login_user(user)

        return {"response": "success", "user": user.json_safe()}, 200


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.json

    if get_user(data["username"]) is not None:
        return {"error": "Имя пользователся уже занято"}, 200
    
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
    
    if user == current_user:
        return {"response": "success", "user": user.json_safe()}

    return {
        "response": "success", 
        "user": user.json()
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
    try:
        image = request.files["avatar"]
    except KeyError:
        image = None
    test = Test(name=data["name"], description=data["description"], author_id=user.id, uuid=uuid.uuid4().hex)

    return {
        "response": "success",
        "test": test.test.id
    }


@app.route("/static/test_icon/<int:tid>")
def test_icon(tid):
    test = Test.query.filter_by(id=tid).first()

    if test is None:
        return {"response": 404}, 404

    try:
        return send_file(os.path.join(TESTS_PATH, ".default.svg"))
    except FileNotFoundError:
        return send_file(os.path.join(TESTS_PATH, test.uuid + test.avatar))


@app.route("/api/test/<int:test_id>")
def get_test(test_id):
    test: Test = Test.query.filter_by(id=test_id).first()
    current_user = get_current_user()

    if test is None:
        return {
            "response": 404
        }, 404

    if current_user is not None and current_user.id == test.author_id:
        return test.safe_json(), 200

    return test.json(), 200


@app.route("/api/edit_test/<int:test_id>", methods=["POST"])
@login_required
def edit_test(user, test_id):
    test = Test.query.filter_by(id=test_id).first()
    if test is None:
        return {"response", 404}, 404

    if user.id != test.author_id:
        return {"response", "unauthorized"}, 401

    test.name = request.form["name"]
    test.description = request.form["description"]

    if len(request.files) != 0:
        ...  # TODO: upload image

    return {"response": "success"}, 200


@app.route("/api/upload_tasks/<int:test_id>", methods=["POST"])
@login_required
def upload_tasks(user, test_id):
    test = Test.query.filter_by(id=test_id).first()
    if test is None:
        return {"response": 404}, 404

    if user.id != test.author_id:
        return {"response", "unauthorized"}, 401

    file = open(os.path.join(TESTS_PATH, str(test.id) + ".json"), "w", encoding="utf8")
    file.write(json.dumps(request.json))
    file.close()

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
        return {
            "response": "unauthorized",
        }, 401

    solution_json = solution.json()

    next_task = 0
    if solution_json["state"] == "running":
        if solution_json["answered"]:
            next_task = max(map(int, solution_json["answered"].keys())) + 1
        if solution_json["skipped"]:
            next_task = max(next_task, max(solution_json["skipped"]) + 1)
    elif solution_json["state"] == "running skipped":
        next_task = min(solution_json["skipped"])
    elif solution_json["state"] == "complete":
        test_db = Test.query.filter_by(id=solution.test_id).first()
        return {
            "state": solution_json["state"],
            "result": list(solution_json["result"]),
            "test": test_db.name,
        }, 200

    with open(os.path.join(TESTS_PATH, str(solution.test_id) + ".json")) as f:
        tasks = json.loads(f.read())
        task = tasks[next_task]
        for el in task:
            if type(el) == dict:
                el["right"] = None

    return {
        "state": solution_json["state"],
        "answered": list(map(int, solution_json["answered"].keys())),
        "skipped": solution_json["skipped"],
        "total_tasks": len(tasks),
        "current_task": next_task,
        "task": task
    }, 200


@app.route("/api/submit_solution/<int:solution_id>", methods=["POST"])
@login_required
def submit_solution(user, solution_id):
    solution = TestSolution.query.filter_by(id=solution_id).first()

    if solution.user_id != user.id:
        return {
            "response": "unauthorized",
        }, 401

    solution_json = solution.json()

    if solution_json["state"] == "complete":
        return {
            "response": "ended",
        }, 403

    submitted_task = request.json

    if submitted_task.get("skip"):
        solution_json["skipped"].append(submitted_task["id"])
    else:
        solution_json["answered"][submitted_task["id"]] = submitted_task["answer"]
        try:
            solution_json["skipped"].remove(submitted_task["id"])
        except ValueError:
            ...  # don't do anything

    with open(os.path.join(TESTS_PATH, str(solution.test_id) + ".json"), "r") as f:
        test = json.load(f)

    if submitted_task["id"] == len(test) - 1:
        if solution_json["state"] == "running" and len(solution_json["skipped"]):
            solution_json["state"] = "running skipped"
        else:
            solution.in_progress = False
            solution.end_time = datetime.datetime.now()
            db.session.commit()
            solution_json["state"] = "complete"

    next_task = 0
    if solution_json["state"] == "running":
        if solution_json["answered"]:
            next_task = max(map(int, solution_json["answered"].keys())) + 1
        if solution_json["skipped"]:
            next_task = max(next_task, max(solution_json["skipped"]) + 1)
    elif solution_json["state"] == "running skipped":
        next_task = min(solution_json["skipped"])
    elif solution_json["state"] == "complete":
        solution_json["result"] = list(utils.generate_results(test, solution_json["answered"]))

        with open(os.path.join(TESTS_PATH, "solutions", str(solution_id) + ".json"), "w") as f:
            f.write(json.dumps(solution_json))

        test_db = Test.query.filter_by(id=solution.test_id).first()
        return {
            "state": solution_json["state"],
            "result": list(solution_json["result"]),
            "test": test_db.name,
        }, 200

    task = test[next_task]
    for el in task:
        if type(el) == dict:
            el["right"] = None

    with open(os.path.join(TESTS_PATH, "solutions", str(solution_id) + ".json"), "w") as f:
        f.write(json.dumps(solution_json))

    return {
        "state": solution_json["state"],
        "answered": list(map(int, solution_json["answered"].keys())),
        "skipped": solution_json["skipped"],
        "total_tasks": len(test),
        "current_task": next_task,
        "task": task
    }, 200


@app.after_request
def add_header(response: Response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response
