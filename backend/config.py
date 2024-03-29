import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    FRONTEND_SERVER = "http://192.168.0.132:3000"
    SECRET_KEY = "8e431c34-1a32-4546-8766-78b0676d2cb7"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(basedir, "static\\")
    AVATAR_FOLDER = os.path.join(basedir, "static\\avatars")