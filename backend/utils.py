from PIL import Image
from werkzeug.datastructures import FileStorage


def crop_and_resize(image: FileStorage | Image.Image, size=(256, 256)) -> Image.Image:
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
