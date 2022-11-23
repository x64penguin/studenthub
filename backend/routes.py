from app import app, db
import json
import os
import utils
from os.path import join
from flask import render_template, redirect, url_for, flash, request, send_file, escape, abort, \
    make_response, jsonify, Response
from models import load_user, get_user, User
import jwt
import uuid
from datetime import datetime, timedelta
from authorization import get_current_user, login_required, login_user, logout_user


@app.route("/api/validate_username", methods=["POST"])
def api_validate_username():
    data = request.json

    return {"response": len(data['username']) != 0 and User.query.filter_by(username=data["username"]).first() is None}, 200


@app.route("/api/load_user")
def load_user():
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
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if user is None or not user.check_password(data["password"]):
        return {"response": "Неверное имя пользователся или пароль"}, 200
    else:
        login_user(user)

        return {"response": "success", "user": user.json_safe()}, 200


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json

    if User.query.filter_by(username=data["username"]).first() is not None:
        return {"error": "Имя пользователся уже занято"}, 200
    
    user = User(username=data["username"], email=data["email"], account_type=data["account-type"], name=data["name"], uuid=uuid.uuid4().hex)
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return {"response": "success"}, 200


@app.route("/api/logout")
@login_required
def logout(user):
    logout_user(user)

    return {"response": "success"}, 200



@app.route("/api/user/<int:uid>")
def get_user(uid):
    current_user = get_current_user()
    user: User = User.query.filter_by(id=uid).first()

    if user is None:
        return {"response": "404"}, 404
    
    if user == current_user:
        return {"response": "success", "user": user.json_safe()}

    return {
        "response": "success", 
        "user": user.json()
    }


@app.route("/static/avatar/<int:uid>")
def get_avatar(uid):
    user = User.query.filter_by(id=uid).first()
    default_path = os.path.join(app.config["UPLOAD_FOLDER"], "avatars", "default.svg")

    if user is None:
        return send_file(default_path)

    return send_file(os.path.join(app.config["UPLOAD_FOLDER"], "avatars", user.avatar) if user.avatar is not None else default_path)


@app.route("/api/edit_profile/<int:uid>", methods=["POST"])
def edit_profile(uid):
    current_user = get_current_user()
    if current_user is None or current_user.id != uid:
        return {"response": "unauthorized"}, 401

    current_user.email = request.form["email"]
    
    try:
        avatar_file = request.files["avatar"]
        ext = avatar_file.filename.split(".")[-1]
        avatar_path = os.path.join(app.config["UPLOAD_FOLDER"], "avatars", str(uid) + "." + ext)
        avatar_file.save(avatar_path)
        current_user.avatar = str(uid) + "." + ext
    except KeyError:
        ... # avatar not changed

    db.session.commit()

    return {"response": "success"}, 200
    
    
@app.after_request
def add_header(response: Response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response