from flask import request
from models import User, UserSession
from functools import wraps
from app import app, db
from datetime import datetime, timedelta
import jwt
import uuid


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return
        token = token.split()[1]

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except jwt.exceptions.InvalidSignatureError:
            return {"response": "token is broken"}, 401
        user = User.query.filter_by(id=data["userid"]).first()

        if user is None:
            return {"response": "not logged in"}, 401

        if data["exp"] < datetime.utcnow().timestamp():
            return {"response": "session expired"}, 401

        session = UserSession.query.filter_by(ip=request.remote_addr, user_id=user.id).first()

        if session is None:
            return {"response": "stop stealing accounts"}, 401

        return f(user, *args, **kwargs)

    return decorated


def get_current_user():
    token = request.headers.get("Authorization")
    if not token or token == "Bearer":
        return
    token = token.split()[1]
    data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    user = User.query.filter_by(id=data["userid"]).first()

    if user is None:
        return

    if data["exp"] < datetime.utcnow().timestamp():
        return

    session = UserSession.query.filter_by(ip=request.remote_addr, user_id=user.id).first()

    if session is None:  # anti token leak
        return

    return user


def login_user(user: User):
    if user == get_current_user():
        return

    expiration_time = datetime.utcnow() + timedelta(days=30)
    token = jwt.encode({
        "userid": user.id,
        "exp": expiration_time
    }, app.config["SECRET_KEY"])

    device = "Mobile" if request.user_agent.string.lower().find("mobi") != -1 else "Desktop"
    session = UserSession(user_id=user.id, expires=expiration_time, ip=request.remote_addr, device=device)
    db.session.add(session)
    db.session.commit()

    return token, expiration_time


def logout_user(user: User):
    session = UserSession.query.filter_by(ip=request.remote_addr).first()

    if session is None:  # shouldn't be none, if none account is stolen xD
        return

    db.session.delete(session)
    db.session.commit()


def logout_ip(ip: str):
    session = UserSession.query.filter_by(ip=ip).first()

    if session is None:
        return

    db.session.remove(session)
    db.session.commit()


def reset_token(user: User) -> str:
    new_expiration_time = datetime.utcnow() + timedelta(days=30)
    new_uuid = uuid.uuid4()

    user.uuid = new_uuid

    token = jwt.encode({
        "userid": user.uuid,
        "exp": new_expiration_time
    }, app.config["SECRET_KEY"])

    db.session.commit()
    return token
