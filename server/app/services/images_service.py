from app.models.images import Image
from app import db


class ImageService:
    @staticmethod
    def create_image(message_id, image_path):
        """
        创建新的图片记录，并与一条消息相关联
        :param message_id: 关联的消息ID
        :param image_path: 图片的路径
        :return: 创建的Image实例
        """
        return Image.create(message_id, image_path)

    # 使用范例：
    # new_image = ImageService.create_image(message_id=1, image_path='uploads/image1.jpg')
    # print(f"Image ID: {new_image.image_id}")

    @staticmethod
    def get_all_images():
        """
        获取所有图片记录
        :return: 所有Image实例的列表
        """
        return Image.query.all()

    # 使用范例：
    # images = ImageService.get_all_images()
    # for image in images:
    #     print(f"Image ID: {image.image_id}")
    #     print(f"Message ID: {image.message_id}")
    #     print(f"Image Path: {image.image_path}")
    #     print(f"Uploaded At: {image.uploaded_at}")

    @staticmethod
    def get_image_by_id(image_id):
        """
        根据图片ID获取图片
        :param image_id: 图片ID
        :return: 对应的Image实例，如果不存在则返回None
        """
        return Image.query.filter_by(image_id=image_id).first()

    @staticmethod
    def get_images_by_message_id(message_id):
        """
        根据消息ID获取与该消息相关联的所有图片
        :param message_id: 消息ID
        :return: 与该消息相关联的图片列表
        """
        return Image.query.filter_by(message_id=message_id).all()

    @staticmethod
    def delete_image(image_id):
        """
        删除指定ID的图片
        :param image_id: 图片ID
        :return: 被删除的Image实例，如果图片不存在则返回None
        """
        image = Image.query.filter_by(image_id=image_id).first()
        if image:
            db.session.delete(image)
            db.session.commit()
        return image

    # 使用范例：
    # deleted_image = ImageService.delete_image(image_id=1)
    # if deleted_image:
    #     print(f"Deleted Image ID: {deleted_image.image_id}")
    # else:
    #     print("Image not found")


    @staticmethod
    def update_image(image_id, message_id=None, image_path=None):
        """
        更新图片记录信息
        :param image_id: 需要更新的图片ID
        :param message_id: 更新后的消息ID（可选）
        :param image_path: 更新后的图片路径（可选）
        :return: 更新后的Image实例，如果图片不存在则返回None
        """
        image = Image.query.filter_by(image_id=image_id).first()
        if image:
            if message_id:
                image.message_id = message_id
            if image_path:
                image.image_path = image_path
            db.session.commit()  # 提交更新
        return image