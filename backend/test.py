from models import User, get_user
from werkzeug.datastructures import FileStorage
from uuid import uuid4
from app import app

import os, json

class TestNotFoundException(Exception):
    pass

class TestDamagedException(Exception):
    pass


class SHTest:
    def __init__(self, author: User, name: str, description: str, image: FileStorage | None = None):
        self.name = name
        self.description = description
        self.uuid = uuid4().hex
        self.author = author

        if image is not None:
            ext = image.filename.split('.')[-1]
            image.save(f"{self.uuid}.{ext}")

    def __init__(self, uuid: str):
        try:
            file = open(os.path.join(app.conifg["UPLOAD_FOLDER"], "tests", uuid + ".json"), "r")
        except FileNotFoundError:
            raise TestNotFoundException(uuid)

        try:
            test = json.dumps(file.read())

            self.name = test["name"]
            self.description = test["description"]
            self.uuid = uuid
            self.author = get_user(test["author"])
            self.tasks = test["tasks"]

            #TODO: decode right asnwers only?
        except:
            raise TestDamagedException(uuid)

        file.close()