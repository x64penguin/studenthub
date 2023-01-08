import json
import uuid

from app import app, db
import os
import utils
from flask import request, send_file, Response
from models import get_user, User, UserSession, Test
from authorization import get_current_user, login_required, login_user, logout_user
from shtest import SHTest, TESTS_PATH


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
def api_logout_ip(user, ip):
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
        ...  #TODO: upload image

    return {"response": "success"}, 200


@app.route("/api/upload_tasks/<int:test_id>", methods=["POST"])
@login_required
def upload_tasks(user, test_id):
    test = Test.query.filter_by(id=test_id).first()
    if test is None:
        return {"response", 404}, 404

    if user.id != test.author_id:
        return {"response", "unauthorized"}, 401

    file = open(os.path.join(TESTS_PATH, test.uuid + ".json"), "w", encoding="utf8")
    file.write(json.dumps(request.json))
    file.close()

    return {"response": "success"}, 200


@app.after_request
def add_header(response: Response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response