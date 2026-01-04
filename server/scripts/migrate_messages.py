"""一次性迁移旧提问箱数据到新结构。"""
from __future__ import annotations

import csv
import os
import sys
from pathlib import Path

import django

sys.path.append(str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "harei.settings")

os_env = Path(__file__).resolve().parents[1] / ".env"
if os_env.exists():
    import dotenv

    dotenv.load_dotenv(os_env)

django.setup()

from apps.core.models import Message, MessageStatus  # noqa: E402
from apps.core.services.image_processing import process_image  # noqa: E402


def migrate(csv_path: Path, images_dir: Path) -> None:
    with csv_path.open("r", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            message = Message.objects.create(
                message_text=row.get("message_text", ""),
                tag=row.get("tag", ""),
                status=row.get("status", MessageStatus.ACTIVE),
                created_at=row.get("created_at") or None,
                ip_address=row.get("ip_address", "0.0.0.0"),
            )

            image_name = row.get("image")
            if image_name:
                image_path = images_dir / image_name
                if image_path.exists():
                    with image_path.open("rb") as image_file:
                        full_file, thumb_file = process_image(image_file)
                        message.image.save(f"{message.message_id}.jpg", full_file, save=False)
                        message.image_thumbnail.save(
                            f"{message.message_id}_thumb.jpg", thumb_file, save=False
                        )
                        message.save(update_fields=["image", "image_thumbnail"])


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit("用法: python migrate_messages.py <csv_path> <images_dir>")

    migrate(Path(sys.argv[1]), Path(sys.argv[2]))
