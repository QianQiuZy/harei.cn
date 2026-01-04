from __future__ import annotations

from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Message, MessageStatus
from .services.image_processing import process_image


def _get_client_ip(request: HttpRequest) -> str:
    return (
        request.headers.get("X-Real-IP")
        or request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        or request.META.get("REMOTE_ADDR", "0.0.0.0")
    )


def frontend_index(request: HttpRequest):
    return render(request, "core/index.html")


@csrf_exempt
def submit_box(request: HttpRequest) -> JsonResponse:
    if request.method != "POST":
        return JsonResponse({"error": "只支持 POST 请求"}, status=405)

    message_text = request.POST.get("message_text", "").strip()
    tag = request.POST.get("tag", "").strip()
    if not message_text:
        return JsonResponse({"error": "message_text 不能为空"}, status=400)

    message = Message.objects.create(
        message_text=message_text,
        tag=tag,
        status=MessageStatus.ACTIVE,
        created_at=timezone.now(),
        ip_address=_get_client_ip(request),
    )

    image_file = request.FILES.get("image")
    if image_file:
        full_file, thumb_file = process_image(image_file)
        message.image.save(f"{message.message_id}.jpg", full_file, save=False)
        message.image_thumbnail.save(f"{message.message_id}_thumb.jpg", thumb_file, save=False)
        message.save(update_fields=["image", "image_thumbnail"])

    return JsonResponse({"message_id": str(message.message_id)}, status=201)


def list_messages(request: HttpRequest) -> JsonResponse:
    status = request.GET.get("status", MessageStatus.ACTIVE)
    if status not in MessageStatus.values:
        status = MessageStatus.ACTIVE

    order_by = "created_at" if status == MessageStatus.ARCHIVED else "-created_at"
    messages = Message.objects.filter(status=status).order_by(order_by)

    return JsonResponse({"messages": [_serialize_message(item) for item in messages]})


def list_tags(request: HttpRequest) -> JsonResponse:
    tags = (
        Message.objects.exclude(tag="")
        .order_by("tag")
        .values_list("tag", flat=True)
        .distinct()
    )
    return JsonResponse({"tags": list(tags)})


def _serialize_message(message: Message) -> dict:
    return {
        "message_id": str(message.message_id),
        "message_text": message.message_text,
        "tag": message.tag,
        "status": message.status,
        "created_at": message.created_at.isoformat(),
        "created_at_display": message.created_at.strftime("%Y-%m-%d %H:%M"),
        "image_url": message.image.url if message.image else None,
        "image_thumbnail_url": message.image_thumbnail.url if message.image_thumbnail else None,
    }
