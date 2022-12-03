from flask import request
from models import User, UserSession
from functools import wraps
from app import app, db
from datetime import datetime, timedelta


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        session: UserSession = UserSession.query.filter_by(ip=request.remote_addr).first()

        if session is None or not session.check(request):
            return {"response": "unauthorized"}, 401

        return f(session.user, *args, **kwargs)

    return decorated


def get_current_user() -> User:
    session: UserSession = UserSession.query.filter_by(ip=request.remote_addr).first()

    if session is None or not session.check(request):
        return None

    return session.user


def login_user(user: User) -> tuple[str, datetime]:
    if user == get_current_user():
        return
    expiration_time = datetime.utcnow() + timedelta(days=30)
    device = "Mobile" if request.user_agent.string.lower().find("mobi") != -1 else "Desktop"
    session = UserSession(user_id=user.id, expires=expiration_time, ip=request.remote_addr, device=device)
    db.session.add(session)
    db.session.commit()


def logout_user(user: User):
    session = UserSession.query.filter_by(ip=request.remote_addr).first()

    if session is None:
        return

    db.session.delete(session)
    db.session.commit()


def logout_ip(ip: str):
    session = UserSession.query.filter_by(ip=ip).first()

    if session is None:
        return

    db.session.remove(session)
    db.session.commit()