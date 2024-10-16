from datetime import datetime
from app import db

# 定义 Music 模型
class Music(db.Model):
    __tablename__ = 'music'  # 表名为 music

    # 字段定义
    music_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 自增主键
    title = db.Column(db.String(255), nullable=False)  # 音乐标题
    artist = db.Column(db.String(255), nullable=False)  # 艺术家
    album = db.Column(db.String(255), nullable=True)  # 专辑（可选）
    release_date = db.Column(db.Date, nullable=True)  # 发行日期（可选）
    duration = db.Column(db.Integer, nullable=True)  # 音乐时长（秒）（可选）
    type = db.Column(db.String(50), nullable=True)  # 音乐类型（可选）
    language = db.Column(db.String(50), nullable=True)  # 语言（可选）
    note = db.Column(db.Text, nullable=True)  # 备注（可选）
    created_at = db.Column(db.DateTime, default=datetime.now)  # 创建时间

    def __repr__(self):
        return f"<Music {self.music_id} - {self.title} by {self.artist}>"

    # 静态方法用于创建音乐条目
    @classmethod
    def create(cls, title, artist, album=None, release_date=None, duration=None, type=None, language=None, note=None):
        new_music = cls(
            title=title,
            artist=artist,
            album=album,
            release_date=release_date,
            duration=duration,
            type=type,
            language=language,
            note=note
        )
        db.session.add(new_music)
        db.session.commit()
        return new_music
