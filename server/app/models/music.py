from app import db

# 定义 Music 模型
class Music(db.Model):
    __tablename__ = 'music'  # 表名为 music

    # 字段定义，与数据库表一致
    music_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 自增主键
    title = db.Column(db.String(255), nullable=False)  # 音乐名称（必填）
    artist = db.Column(db.String(255), nullable=False)  # 艺术家（必填）
    type = db.Column(db.String(50), nullable=True)  # 音乐类型（可选）
    language = db.Column(db.String(50), nullable=True)  # 语言（可选）
    note = db.Column(db.Text, nullable=True)  # 备注（可选）

    def __repr__(self):
        return f"<Music {self.music_id} - {self.title} by {self.artist}>"

    # 静态方法用于创建新的音乐条目
    @classmethod
    def create(cls, title, artist, type=None, language=None, note=None):
        new_music = cls(
            title=title,
            artist=artist,
            type=type,
            language=language,
            note=note
        )
        db.session.add(new_music)
        db.session.commit()
        return new_music
