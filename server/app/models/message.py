# /app/models/message.py
from app import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = "messages"

    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    guest_id = db.Column(db.String(255), nullable=False)
    message_text = db.Column(db.Text, nullable=True)
    tag = db.Column(db.String(255), default=None)  # 新增TAG字段
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f"<Message {self.message_id}: {self.message_text}>"

    @classmethod
    def create(cls, guest_id, message_text, tag=None):
        new_message = cls(guest_id=guest_id, message_text=message_text, tag=tag)
        db.session.add(new_message)
        db.session.commit()
        return new_message
