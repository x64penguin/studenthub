from flask import request
from models import User, UserSession
from functools import wraps
from app import app, db
from datetime import datetime, timedelta
import jwt, uuid


def login_required(f):
    @wraps(f)

    def decorated(*args, **kwargs):
        cookies = request.cookies
        try:
            token = cookies["token"]
        except KeyError:
            return {"response": "not logged in"}, 401
        
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except jwt.exceptions.InvalidSignatureError:
            return {"response": "token is broken"}, 401
        user = User.query.filter_by(uuid=data["userid"]).first()
    
        if user is None:
            return {"response": "not logged in"}, 401
        
        if data["exp"] < datetime.utcnow().timestamp():
            return {"response": "session expired"}, 401

        session = UserSession.query.filter_by(user_id=user.id).first()

        if session is None or session.ip != request.remote_addr:
            return {"response": "stop stealing accounts"}, 401

        return f(user, *args, **kwargs)

    return decorated


def get_current_user() -> User:
    cookies = request.cookies
    try:
        token = cookies["token"]
    except KeyError:
        return None


    data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    user = User.query.filter_by(uuid=data["userid"]).first()

    if user is None:
        return None
    
    if data["exp"] < datetime.utcnow().timestamp():
        return None

    session = UserSession.query.filter_by(user_id=user.id).first()

    if session is None or session.ip != request.remote_addr: # anti token leak
        return None

    return user


def login_user(user: User) -> tuple[str, datetime]:
    expiration_time = datetime.utcnow() + timedelta(days=30)
    token = jwt.encode({
        "userid": user.uuid,
        "exp": expiration_time
    }, app.config["SECRET_KEY"])

    session = UserSession(user_id=user.id, token=token, ip=request.remote_addr)
    db.session.add(session)
    db.session.commit()

    return token, expiration_time


def logout_user(user: User):
    session = UserSession.query.filter_by(ip=request.remote_addr).first()

    if session is None: # shouldnt be none, if none account is stolen xD
        return

    db.session.delete(session)
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