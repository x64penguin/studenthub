from app import app, db
import json
import os
from os.path import join
from flask import render_template, redirect, url_for, flash, request, send_file, escape, abort, \
    make_response
from flask_login import current_user, login_user, logout_user, login_required
from models import load_user, User


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", user=current_user, url_for=url_for)


@app.route("/login", methods=["GET", "POST"])
def login_page():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            flash("Неверное имя пользователя или пароль")
            return redirect(url_for("login_page"))
        login_user(user, remember=bool(request.form.get("remember-me")))

        redirect_url = url_for("index")
        if request.args.get("redirect") is not None:
            redirect_url = request.args.get("redirect")

        return redirect(redirect_url)
    return render_template("login.html", user=current_user)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        password_confirm = request.form.get("password_confirm")
        account_type = request.form.get("account-type")

        if User.query.filter_by(username=username).first() is not None:
            flash("Имя пользователя уже занято")
            return render_template("register.html", user=current_user)

        if User.query.filter_by(email=email).first() is not None:
            flash("Пользователь с такой почтой уже существует")
            return render_template("register.html", user=current_user)

        user = User(username=username, email=email, account_type=account_type)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        redirect_url = url_for("index")
        if request.args.get("redirect") is not None:
            redirect_url = request.args.get("redirect")

        return redirect(redirect_url)
    return render_template("register.html", user=current_user)