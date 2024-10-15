from datetime import datetime
from app import db  # 假设你的 SQLAlchemy 对象是从 app 引入的


class Image(db.Model):
    __tablename__ = "images"

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 自增主键
    message_id = db.Column(
        db.Integer, db.ForeignKey("messages.message_id"), nullable=False
    )  # 外键关联 Message
    image_path = db.Column(db.String(255), nullable=False)  # 图片路径
    uploaded_at = db.Column(db.DateTime, default=datetime.now)  # 上传时间

    # 定义与 Message 的关系
    message = db.relationship("Message", backref=db.backref("images", lazy=True))

    def __repr__(self):
        return f"<Image {self.image_id}: {self.image_path}>"

    # 定义保存图片的方法
    @classmethod
    def create(cls, message_id, image_path):
        # 创建 Image 实例
        new_image = cls(message_id=message_id, image_path=image_path)

        # 添加到数据库会话并提交
        db.session.add(new_image)
        db.session.commit()

        # 返回创建的图片实例
        return new_image
