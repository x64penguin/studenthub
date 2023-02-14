import json
import os

from PIL import Image
from werkzeug.datastructures import FileStorage
from models import TESTS_PATH, Test


def crop_and_resize(image, size=(256, 256)) -> Image.Image:
    if type(image) is FileStorage:
        image = Image.open(image)
    crop_start, crop_end = [0, 0], [image.width, image.height]
    if image.width > image.height:
        crop_start = [image.width // 2 - image.height // 2, 0]
        crop_end = [image.width // 2 + image.height // 2, image.height]
    else:
        crop_start = [0, image.height // 2 - image.width // 2]
        crop_end = [image.width, image.height // 2 + image.height // 2]
    cropped = image.crop((crop_start[0], crop_start[1], crop_end[0], crop_end[1]))
    return cropped.resize(size)


def count_tasks(test):
    counter = 0
    for el in test:
        if type(el) == dict:
            counter += 1
    return counter


def get_element_by_name(name: str, task: list):
    for el in task:
        if type(el) == dict and el['name'] == name:
            return el
    return None


def generate_results(test: list, answers: dict) -> tuple[int, int, dict[dict[bool]]]:
    max_points = sum([sum([x["points"] for x in y if type(x) == dict]) for y in test])
    errors = {}
    points = 0
    for task_idx, task_answers in answers.items():
        task = test[int(task_idx)]
        errors[task_idx] = {}
        for el_name, answer in task_answers.items():
            element = get_element_by_name(el_name, task)
            if element["qtype"] == "input":
                if element["right"] == answer:
                    points += element["points"]
                    errors[task_idx][el_name] = False
                else:
                    errors[task_idx][el_name] = True
            elif element["qtype"] == "select":
                right = True
                for variant in answer.keys():
                    if answer[variant] and variant not in element["right"]:
                        right = False
                        break
                    elif not answer[variant] and variant in element["right"] and not element["right"][variant]:
                        right = False
                        break
                if right:
                    points += element["points"]
                errors[task_idx][el_name] = not right
            elif element["qtype"] == "order":
                right = answer == element["right"]
                if right:
                    points += element["points"]
                errors[task_idx][el_name] = not right
            else:
                right = True
                for group in answer[1].keys():
                    if sorted(answer[1][group]) != sorted(element["right"][group]):
                        right = False
                if right:
                    points += element["points"]
                errors[task_idx][el_name] = not right
    return points, max_points, errors


def get_solution(solution, solution_json=None, update=False, test=None):
    if solution_json is None:
        with open(os.path.join(TESTS_PATH, "solutions", str(solution.id) + ".json"), "r") as f:
            solution_json = json.loads(f.read())

    next_task = 0
    if solution_json["state"] == "running":
        if solution_json["answered"]:
            next_task = max(map(int, solution_json["answered"].keys())) + 1
        if solution_json["skipped"]:
            next_task = max(next_task, max(solution_json["skipped"]) + 1)
    elif solution_json["state"] == "running skipped":
        next_task = min(solution_json["skipped"])
    elif solution_json["state"] == "complete":
        if test is None:
            with open(os.path.join(TESTS_PATH, str(solution.test_id) + ".json"), "r") as f:
                test = json.load(f)

        points, max_points, errors = generate_results(test, solution_json["answered"])
        solution_json["result"] = [points, max_points]
        solution_json["errors"] = errors

        if update:
            with open(os.path.join(TESTS_PATH, "solutions", str(solution.id) + ".json"), "w") as f:
                f.write(json.dumps(solution_json))

        test_db = Test.query.filter_by(id=solution.test_id).first()
        return {
            "state": solution_json["state"],
            "answered": solution_json["answered"],
            "result": list(solution_json["result"]),
            "errors": solution_json["errors"],
            "test": test_db.safe_json(),
        }

    with open(os.path.join(TESTS_PATH, str(solution.test_id) + ".json")) as f:
        tasks = json.loads(f.read())
        task = tasks[next_task]
        for el in task:
            if type(el) == dict:
                el["right"] = None

    return {
        "state": solution_json["state"],
        "answered": list(map(int, solution_json["answered"].keys())),
        "skipped": solution_json["skipped"],
        "total_tasks": len(tasks),
        "current_task": next_task,
        "task": task,
        "test": solution.test.json(),
    }