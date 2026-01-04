from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.core"
    verbose_name = "花礼核心"

    def ready(self) -> None:
        from .services.music_cache import music_cache

        music_cache.prime()
