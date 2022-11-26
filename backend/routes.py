from app import app, db
import os
import utils
from os.path import join
from flask import request, send_file, Response
from models import get_user, User, UserSession
from authorization import get_current_user, login_required, login_user, logout_user
from PIL import Image


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

    return send_file(os.path.join(app.config["AVATAR_FOLDER"], user.avatar) if user.avatar is not None else default_path)


@app.route("/api/edit_profile/<int:uid>", methods=["POST"])
@login_required
def api_edit_profile(current_user, uid):
    if current_user.id != uid:
        return {"response": "unauthorized"}, 401

    current_user.email = request.form["email"]
    
    try:
        avatar_file = request.files["avatar"]
        ext = avatar_file.filename.split(".")[-1]
        img = Image.open(avatar_file)
        #TODO: crop to square and resize 256x256
        avatar_path = os.path.join(app.config["AVATAR_FOLDER"], str(uid) + "." + ext)
        avatar_file.save(avatar_path)
        current_user.avatar = str(uid) + "." + ext
    except KeyError:
        ... # avatar not changed

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


    
@app.after_request
def add_header(response: Response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response