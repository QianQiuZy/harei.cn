from app.models.music import Music
from app import db

class MusicService:
    @staticmethod
    def create_music(title, artist, type=None, language=None, note=None):
        """
        创建新的音乐条目
        """
        # 创建新的音乐条目，匹配现有的Music模型
        new_music = Music.create(
            title=title,
            artist=artist,
            type=type,
            language=language,
            note=note
        )
        return new_music

    @staticmethod
    def get_all_music():
        """
        获取所有音乐
        """
        return Music.query.all()

    @staticmethod
    def get_music_by_id(music_id):
        """
        根据ID获取音乐
        """
        return Music.query.filter_by(music_id=music_id).first()

    @staticmethod
    def update_music(music_id, title=None, artist=None, type=None, language=None, note=None):
        """
        更新音乐信息
        """
        music = MusicService.get_music_by_id(music_id)
        if music:
            if title:
                music.title = title
            if artist:
                music.artist = artist
            if type:
                music.type = type
            if language:
                music.language = language
            if note:
                music.note = note

            db.session.commit()  # 提交更改
        return music

    @staticmethod
    def delete_music(music_id):
        """
        删除音乐条目
        """
        music = MusicService.get_music_by_id(music_id)
        if music:
            db.session.delete(music)
            db.session.commit()  # 提交更改
        return music
