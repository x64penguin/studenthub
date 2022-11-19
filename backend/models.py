from sqlalchemy import func, select
from sqlalchemy.orm import column_property

from app import db, login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.ext.associationproxy import association_proxy


@login.user_loader
def load_user(uid):
    return User.query.get(int(uid))


def get_user(uid):
    return User.query.filter_by(id=uid).first()


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(128), unique=True)
    account_type = db.Column(db.Integer)
    password_hash = db.Column(db.String(128))
    avatar = db.Column(db.String(128), default=None)
    sessions = db.relationship("UserSession", backref="user", lazy="dynamic")

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def jsonify_sessions(self):
        sessions = []

        for session in self.sessions:
            sessions.append({
                "ip": session.ip,
                "expires": session.expires,
            })

        return sessions

    def json_safe(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "email": self.email,
            "account_type": self.account_type,
            "avatar": self.avatar,
            "sessions": self.jsonify_sessions()
        }
    
    def json(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "account_type": self.account_type,
            "avatar": self.avatar
        }


class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    expires = db.Column(db.DateTime)
    ip = db.Column(db.String(32))

    def check(self, request) -> bool:
        return request.remote_addr == self.ip and datetime.utcnow() < self.expires