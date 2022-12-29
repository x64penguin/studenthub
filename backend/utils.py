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
