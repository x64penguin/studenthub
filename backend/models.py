import json

from sqlalchemy import func, select
from sqlalchemy.orm import column_property

import os
from app import db, app
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
from sqlalchemy.ext.associationproxy import association_proxy

TESTS_PATH = os.path.join(app.config["UPLOAD_FOLDER"], "tests")


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(128), unique=True)
    account_type = db.Column(db.Integer)
    password_hash = db.Column(db.String(128))
    joined: date = db.Column(db.Date, default=date.today())
    sessions = db.relationship("UserSession", backref="user", lazy="dynamic")
    tests_created = db.relationship("Test", backref="user", lazy="dynamic")

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def jsonify_sessions(self):
        sessions = []

        for session in self.sessions:
            sessions.append({
                "device": session.device,
                "ip": session.ip,
                "expires": session.expires,
            })

        return sessions

    def json_safe(self) -> dict:
        base_json = self.json()
        base_json["email"] = str(self.email) # for some reason email has been sending as array
        base_json["sessions"] = self.jsonify_sessions()

        return base_json

    def json(self) -> dict:
        result =  {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "account_type": self.account_type,
            "joined": self.joined.strftime("%d %B %Y"),
            "tests_created": [],
            "badge": ["admin", "Админ"] if self.id == 1 else ["teacher", "Учитель"] if self.account_type == 1 else ["student", "Ученик"]
        }

        for test in self.tests_created:
            result["tests_created"].append(test.json())
        return result


def get_user(identifier: int | str) -> User:
    """Get user by id or username"""
    if type(identifier) == int:
        return User.query.filter_by(id=identifier).first()
    else:
        return User.query.filter_by(username=identifier).first()


class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    expires = db.Column(db.DateTime)
    ip = db.Column(db.String(32))
    device = db.Column(db.String(128))

    def check(self, request) -> bool:
        return request.remote_addr == self.ip


class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    description = db.Column(db.String(128))

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "author": self.author_id,
        }

    def safe_json(self):
        with open(os.path.join(TESTS_PATH, str(self.id) + ".json"), "r", encoding="utf8") as tasks_file:
            tasks = json.loads(tasks_file.read())

        base_json = self.json()
        base_json["tasks"] = tasks

        return base_json


class TestSolution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    test_id = db.Column(db.Integer, db.ForeignKey("test.id"))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    in_progress = db.Column(db.Boolean, default=True)

    def json(self):
        with open(os.path.join(TESTS_PATH, "solutions", str(self.id) + ".json"), "r") as f:
            solution = json.loads(f.read())

        return solution

    @property
    def test(self):
        return Test.query.filter_by(id=self.test_id).first()