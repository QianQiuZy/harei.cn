from django.contrib import admin
from django.contrib.admin import AdminSite
from django.db.models import Count
from django.utils import timezone

from .models import CaptainEvent, GiftRecord, Message, MusicTrack


class HareiAdminSite(AdminSite):
    site_header = "花礼管理后台"
    site_title = "花礼后台"
    index_title = "运营总览"

    def each_context(self, request):
        context = super().each_context(request)
        active_count = Message.objects.filter(status="active").count()
        archived_count = Message.objects.filter(status="archived").count()
        deleted_count = Message.objects.filter(status="deleted").count()
        tags = (
            Message.objects.exclude(tag="")
            .values("tag")
            .annotate(total=Count("id"))
            .order_by("-total")
        )
        month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        captain_count = CaptainEvent.objects.filter(started_at__gte=month_start).count()
        latest_captain = CaptainEvent.objects.order_by("-started_at").first()
        context["dashboard"] = {
            "active_count": active_count,
            "archived_count": archived_count,
            "deleted_count": deleted_count,
            "tags": tags,
            "captain_count": captain_count,
            "latest_captain": latest_captain,
        }
        return context


admin_site = HareiAdminSite(name="harei_admin")


@admin.register(Message, site=admin_site)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("message_id", "tag", "status", "created_at", "ip_address")
    list_filter = ("status", "tag")
    search_fields = ("message_text", "tag", "ip_address")
    ordering = ("-created_at",)


@admin.register(CaptainEvent, site=admin_site)
class CaptainEventAdmin(admin.ModelAdmin):
    list_display = ("nickname", "identity_code", "level", "started_at")
    list_filter = ("level",)
    search_fields = ("nickname", "identity_code")
    ordering = ("-started_at",)


@admin.register(GiftRecord, site=admin_site)
class GiftRecordAdmin(admin.ModelAdmin):
    list_display = ("sender", "gift_name", "count", "created_at")
    list_filter = ("gift_name",)
    search_fields = ("sender", "gift_name")
    ordering = ("-created_at",)


@admin.register(MusicTrack, site=admin_site)
class MusicTrackAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "artist")
    ordering = ("-updated_at",)
