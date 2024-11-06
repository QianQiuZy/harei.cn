# /app/models/gift.py
from app import db  # 导入已初始化的 db 实例

class GiftRanking(db.Model):
    __tablename__ = "gift_ranking"

    user_uid = db.Column(db.String(255), primary_key=True)  # 用户唯一UID，主键
    username = db.Column(db.String(255), nullable=True)     # 用户名字段
    gift_count = db.Column(db.Integer, default=0, nullable=False)  # 礼物数量

    def __repr__(self):
        return f"<GiftRanking {self.user_uid}: {self.username}, {self.gift_count}>"

    # 更新或创建礼物数据，并同步更新用户名
    @classmethod
    def update_or_create(cls, user_uid, username, gift_count):
        gift_record = cls.query.filter_by(user_uid=user_uid).first()
        
        if gift_record:
            # 更新礼物数量和用户名（如发生变化）
            gift_record.gift_count += gift_count
            if gift_record.username != username:
                gift_record.username = username
        else:
            # 创建新的礼物记录
            gift_record = cls(user_uid=user_uid, username=username, gift_count=gift_count)
            db.session.add(gift_record)
        
        db.session.commit()
        return gift_record