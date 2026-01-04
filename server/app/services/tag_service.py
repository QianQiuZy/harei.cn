# /server/app/services/tag_service.py
from app.models.tag import Tag
from app import db

class TagService:
    @staticmethod
    def add_tag(tag_name):
        # 如果TAG不存在则新增
        tag = Tag.query.filter_by(tag_name=tag_name).first()
        if not tag:
            tag = Tag(tag_name=tag_name)
            db.session.add(tag)
            db.session.commit()
        return tag

    @staticmethod
    def delete_tag(tag_name):
        tag = Tag.query.filter_by(tag_name=tag_name).first()
        if tag:
            db.session.delete(tag)
            db.session.commit()
            return True
        return False

    @staticmethod
    def get_all_tags():
        return Tag.query.all()
