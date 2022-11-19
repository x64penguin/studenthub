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
from authorization import get_current_user, login_required, login_user, logout_user, reset_token


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
            "user": {
                "id": user.id,
                "username": user.username,
                "name": user.name,
                "email": user.email,
                "account_type": user.account_type,
                "avatar": user.avatar
            },
            "auth": True
        }, 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if user is None or not user.check_password(data["password"]):
        return {"response": "Неверное имя пользователся или пароль"}, 200
    else:
        token, expires = login_user(user)
        resp = make_response({
            "response": "success", 
            "token": token, 
            "user": {
                "id": user.id,
                "username": user.username,
                "name": user.name,
                "email": user.email,
                "account_type": user.account_type,
                "avatar": user.avatar
            },
        }, 200)
        resp.set_cookie("token", token, expires=expires, domain="192.168.0.251")

        return resp


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

    resp = make_response({"response": "success"})
    resp.set_cookie("token", value="", expires=0)

    return resp


@app.route("/api/regenerate_token")
@login_required
def regenerate_token(user):
    token = reset_token(user)

    return {"response": "success", "token": token}, 200



@app.route("/api/get_user/<int:uid>")
def get_user(uid):
    user = User.query.filter_by(id=uid).first()

    if user is None:
        return {"response": "404"}, 404
    return {
        "response": "success", 
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "account-type": user.account_type,
            "avatar": user.avatar,
            "name": user.name,
        }
    }


@app.after_request
def add_header(response: Response):
    response.headers['Access-Control-Allow-Origin'] = request.headers["origin"]
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Origin, X-Requested-With'
    response.headers['Access-Control-Allow-Credentials'] = "true"
    return response