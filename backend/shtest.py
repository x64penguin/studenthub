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
    def __init__(self, author: User, name: str, description: str, image: FileStorage | None = None):
        self.name = name
        self.description = description
        self.uuid = uuid4().hex
        self.author = author

        print(image)

        if image is not None:
            ext = image.filename.split('.')[-1]
            image.save(os.path.join(TESTS_PATH, f"{self.uuid}.{ext}"))

        self.test = Test(name=name, author_id=author.id, description=description, uuid=self.uuid)
        db.session.add(self.test)
        db.session.commit()
        file = open(os.path.join(TESTS_PATH, self.uuid + ".json"), "w", encoding="utf8")
        file.write("[]")
        file.close()
        print("saved")

    def load(self, uuid: str):
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
        except:
            raise TestDamagedException(uuid)

        file.close()