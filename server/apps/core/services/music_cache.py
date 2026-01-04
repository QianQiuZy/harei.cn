from __future__ import annotations

from dataclasses import dataclass, field
from datetime import timedelta
from django.utils import timezone

from ..models import MusicTrack


@dataclass
class MusicCache:
    tracks: list[dict] = field(default_factory=list)
    refreshed_at: timezone.datetime | None = None

    def prime(self) -> None:
        self.refresh(force=True)

    def refresh(self, force: bool = False) -> None:
        if not force and self.refreshed_at and timezone.now() - self.refreshed_at < timedelta(days=1):
            return
        self.tracks = [
            {
                "title": track.title,
                "artist": track.artist,
                "source_url": track.source_url,
            }
            for track in MusicTrack.objects.filter(is_active=True)
        ]
        self.refreshed_at = timezone.now()

    def get_tracks(self) -> list[dict]:
        self.refresh()
        return self.tracks


music_cache = MusicCache()
