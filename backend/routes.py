from app import app, db
import json
import os
import utils
from os.path import join
from flask import render_template, redirect, url_for, flash, request, send_file, escape, abort, \
    make_response, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from models import load_user, get_user, User


# @app.route("/")
# def index():
#     return render_template("index.html", user=current_user, url_for=url_for)


# @app.route("/login", methods=["GET", "POST"])
# def login_page():
#     if request.method == "POST":
#         username = request.form.get("username")
#         password = request.form.get("password")
#         user = User.query.filter_by(username=username).first()
#         if user is None or not user.check_password(password):
#             flash("Неверное имя пользователя или пароль")
#             return redirect(url_for("login_page"))
#         login_user(user, remember=bool(request.form.get("remember-me")))

#         redirect_url = url_for("index")
#         if request.args.get("redirect") is not None:
#             redirect_url = request.args.get("redirect")

#         return redirect(redirect_url)
#     return render_template("login.html", user=current_user, checkbox=utils.checkbox)


# @app.route("/register", methods=["GET", "POST"])
# def register():
#     if request.method == "POST":
#         username = request.form.get("username")
#         email = request.form.get("email")
#         password = request.form.get("password")
#         password_confirm = request.form.get("password_confirm")
#         account_type = request.form.get("account-type")

#         if User.query.filter_by(username=username).first() is not None:
#             flash("Имя пользователя уже занято")
#             return render_template("register.html", user=current_user)

#         if User.query.filter_by(email=email).first() is not None:
#             flash("Пользователь с такой почтой уже существует")
#             return render_template("register.html", user=current_user)

#         user = User(username=username, email=email, account_type=account_type)
#         user.set_password(password)
#         db.session.add(user)
#         db.session.commit()

#         redirect_url = url_for("index")
#         if request.args.get("redirect") is not None:
#             redirect_url = request.args.get("redirect")

#         return redirect(redirect_url)
#     return render_template("register.html", user=current_user)


# @app.route("/logout")
# def logout():
#     logout_user()
#     return redirect(request.referrer)


# @app.route("/user/<int:uid>")
# def user_page(uid):
#     user = get_user(uid)

#     if user is None:
#         #TODO: create error page
#         ...
    
#     return render_template("user.html", user=user)


# @app.route("/utils/validator")
# def validator():
#     val = request.args
#     if val['type'] == "username":
#         return str(User.query.filter_by(username=val['value']).first() is None)
#     elif val['type'] == "email":
#         return str(User.query.filter_by(email=val['value']).first() is None)
#     else:
#         return abort(404)


@app.route("/api/user")
def api_get_user():
    if current_user.is_authenticated:
        return {
            "auth": True,
            "user": {
                "username": current_user.username,
                "email": current_user.email,
                "account-type": current_user.account_type,
                "avatar": current_user.avatar,
            }
        }, 200
    else:
        return {
            "auth": False,
            "user": {}
        }, 200


@app.route("/api/login_user", methods=["POST"])
def api_login_user():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if user is None or not user.check_password(data["password"]):
        return {"response": "Неверное имя пользователся или пароль"}, 200
    else:
        #TODO: login
        return {"response": "success"}, 200


@app.route("/api/validate_username", methods=["POST"])
def api_validate_username():
    data = request.json

    return {"response": User.query.filter_by(username=data["username"]).first() is None}, 200


@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response