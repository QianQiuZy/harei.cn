from __future__ import annotations

from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile


def _convert_to_jpeg(image: Image.Image) -> Image.Image:
    if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
        background = Image.new("RGBA", image.size, (255, 255, 255, 255))
        background.paste(image, mask=image.split()[-1])
        image = background
    return image.convert("RGB")


def process_image(image_file, *, thumbnail_size=(640, 640)) -> tuple[ContentFile, ContentFile]:
    image = Image.open(image_file)
    image = _convert_to_jpeg(image)

    full_output = BytesIO()
    image.save(full_output, format="JPEG", quality=80)

    thumbnail = image.copy()
    thumbnail.thumbnail(thumbnail_size)
    thumb_output = BytesIO()
    thumbnail.save(thumb_output, format="JPEG", quality=80)

    full_file = ContentFile(full_output.getvalue())
    thumb_file = ContentFile(thumb_output.getvalue())
    return full_file, thumb_file
