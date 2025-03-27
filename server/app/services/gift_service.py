# /server/app/services/gift_service.py
from app.models.gift import GiftRanking

class GiftService:
    @staticmethod
    def update_or_create(user_uid, username, gift_count):
        """
        更新礼物数量并同步用户名。
        """
        return GiftRanking.update_or_create(user_uid=user_uid, username=username, gift_count=gift_count)

    @staticmethod
    def get_gift_ranking(limit=20):
        return GiftRanking.query.order_by(GiftRanking.gift_count.desc()).limit(limit).all()

    @staticmethod
    def get_gift_record(user_uid):
        return GiftRanking.query.filter_by(user_uid=user_uid).first()