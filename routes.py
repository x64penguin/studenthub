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
            flash("Неверное имя пользователья или пароль")
            return redirect(url_for("login_page"))
        login_user(user, remember=True)

        def_redirect = url_for("index")
        if request.args.get("redirect") is not None:
            def_redirect = request.args.get("redirect")
        return redirect(def_redirect)
    return render_template("login.html", user=current_user, url_for=url_for)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        password_confirm = request.form.get("password_confirm")
        account_type = request.form.get("account-type")

        user = User(username=username, email=email, account_type=account_type)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        def_redirect = url_for("index")
        if request.args.get("redirect") is not None:
            def_redirect = request.args.get("redirect")
        return redirect(def_redirect)
    return render_template("register.html", user=current_user, url_for=url_for)