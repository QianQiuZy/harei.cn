# /server/app/services/message_service.py
from app.models.message import Message
from app import db


class MessageService:
    @staticmethod
    def create_message(guest_id, message_text):
        return Message.create(guest_id, message_text)

    # 使用范例：
    # new_message = MessageService.create_message('guest_id', "message_text")
    # print("test success:",new_message.message_id)

    @staticmethod
    def get_all_messages():
        return Message.query.all()

    # 使用范例：
    # messages = MessageService.get_all_messages()
    # # 遍历并打印每条消息的详细信息
    # for message in messages:
    #     print(f"Message ID: {message.message_id}")
    #     print(f"Guest ID: {message.guest_id}")
    #     print(f"Message Text: {message.message_text}")
    #     print(f"Created At: {message.created_at}")
    #     print("-" * 30)

    @staticmethod
    def get_message_by_id(message_id):
        return Message.query.filter_by(message_id=message_id).first()

    @staticmethod
    def delete_message(message_id):
        message = Message.query.get(message_id)
        if message:
            for image in message.images:
                db.session.delete(image)
            db.session.delete(message)
            db.session.commit()
    
    @staticmethod
    def get_pending_messages():
        # 查询所有未审核的留言
        return Message.query.filter_by(status='pending').all()

    @staticmethod
    def get_approved_messages():
        # 查询所有审核通过的留言
        return Message.query.filter_by(status='approved').all()
    
    @staticmethod
    def update_message_status(message_id, new_status):
        message = Message.query.get(message_id)
        if message:
            message.status = new_status
            db.session.commit()