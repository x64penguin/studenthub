from main import app, db
import json
import os
from os.path import join
from flask import render_template, redirect, url_for, flash, request, send_file, escape, abort, \
    make_response
from flask_login import current_user, login_user, logout_user, login_required


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", user=current_user)
