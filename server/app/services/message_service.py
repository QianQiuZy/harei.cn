# /server/app/services/message_service.py
from app.models.message import Message
from app import db

class MessageService:
    @staticmethod
    def create_message(guest_id, message_text, tag=None):
        return Message.create(guest_id, message_text, tag)

    @staticmethod
    def get_all_messages():
        return Message.query.all()

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
        return Message.query.filter_by(status='pending').all()

    @staticmethod
    def get_approved_messages():
        return Message.query.filter_by(status='approved').all()
    
    @staticmethod
    def update_message_status(message_id, new_status):
        message = Message.query.get(message_id)
        if message:
            message.status = new_status
            db.session.commit()
