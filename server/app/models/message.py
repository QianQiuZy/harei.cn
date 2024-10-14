# /app/models/message.py
from app import db  # 导入已经初始化的 db 实例
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'
    
    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 自增主键
    guest_id = db.Column(db.String(255), nullable=False)  # 访客 ID
    message_text = db.Column(db.Text, nullable=True)  # 留言内容
    created_at = db.Column(db.DateTime, default=datetime.now)  # 创建时间

    def __repr__(self):
        return f"<Message {self.id}: {self.message_text}>"

    # 定义保存消息的方法
    @classmethod
    def create(cls, guest_id, message_text):
        # 创建 Message 实例
        new_message = cls(guest_id=guest_id, message_text=message_text)
        
        # 添加到数据库会话并提交
        db.session.add(new_message)
        db.session.commit()

        # 返回创建的消息实例
        return new_message
