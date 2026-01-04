import uuid
from django.db import models
from django.utils import timezone


class MessageStatus(models.TextChoices):
    ACTIVE = "active", "有效"
    ARCHIVED = "archived", "历史"
    DELETED = "deleted", "已删除"


class Message(models.Model):
    message_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    message_text = models.TextField()
    tag = models.CharField(max_length=64, blank=True)
    status = models.CharField(max_length=16, choices=MessageStatus.choices, default=MessageStatus.ACTIVE)
    created_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField()
    image = models.ImageField(upload_to="messages/%Y/%m/%d/", blank=True, null=True)
    image_thumbnail = models.ImageField(upload_to="messages/thumbnails/%Y/%m/%d/", blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["tag"]),
        ]

    def __str__(self) -> str:
        return f"{self.message_id} {self.tag}"


class CaptainEvent(models.Model):
    identity_code = models.CharField(max_length=64)
    nickname = models.CharField(max_length=64)
    level = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self) -> str:
        return f"{self.nickname} ({self.identity_code})"


class GiftRecord(models.Model):
    sender = models.CharField(max_length=64)
    gift_name = models.CharField(max_length=64)
    count = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.sender} {self.gift_name}"


class MusicTrack(models.Model):
    title = models.CharField(max_length=128)
    artist = models.CharField(max_length=128, blank=True)
    source_url = models.URLField()
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} - {self.artist}"
