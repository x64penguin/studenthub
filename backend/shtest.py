from models import User, Test, get_user, TESTS_PATH
from werkzeug.datastructures import FileStorage
from uuid import uuid4
from app import app, db

import os, json


class TestNotFoundException(Exception):
    pass


class TestDamagedException(Exception):
    pass


class SHTest:
    def __init__(self, test: Test):
        self.name = test.name
        self.description = test.description
        self.uuid = test.uuid
        self.author = User.query.filter_by(id=test.author_id).first()
        self.test = test

        try:
            file = open(os.path.join(app.conifg["UPLOAD_FOLDER"], "tests", self.uuid + ".json"), "r")
        except FileNotFoundError:
            raise TestNotFoundException(self.uuid)

        self.tasks = json.loads(file.read())

    def change_image(self, image: FileStorage):
        try:
            file = open(os.path.join(app.conifg["UPLOAD_FOLDER"], "tests", self.uuid + "." + self.test.avatar), "r")
            os.remove(file.name)
        except FileNotFoundError:
            pass  # nothing to delete

        ext = image.filename.split(".")[-1]
        image.save(os.path.join(app.conifg["UPLOAD_FOLDER"], "tests", self.uuid + "." + ext))