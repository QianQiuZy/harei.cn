# koshuihuangdou.py
import asyncio
import http.cookies
import random
from typing import Optional
import logging

import aiohttp
import blivedm
import blivedm.models.web as web_models

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# 数据库相关配置（使用 SQLAlchemy）
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

DB_CONFIG = {
    "host": "localhost",
    "user": "harei",
    "password": "hareillbc0301",
    "db": "harei",
    "port": 3306,
}

engine = create_engine(
    f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['db']}",
    echo=False,
    pool_recycle=3600,      # Recycle connections after 3600 seconds, adjust according to your server's wait_timeout value
    pool_pre_ping=True      # Check if connection is alive before using it
)

Session = sessionmaker(bind=engine)
db_session = Session()
Base = declarative_base()

# 集成 gift.py 中的模型
class GiftRanking(Base):
    __tablename__ = "gift_ranking"

    user_uid = Column(String(255), primary_key=True)
    username = Column(String(255), nullable=True)
    gift_count = Column(Integer, default=0, nullable=False)

    def __repr__(self):
        return f"<GiftRanking {self.user_uid}: {self.username}, {self.gift_count}>"

    @classmethod
    def update_or_create(cls, user_uid, username, gift_count, retries=3):
        for attempt in range(retries):
            try:
                gift_record = db_session.query(cls).filter_by(user_uid=user_uid).first()
                if gift_record:
                    gift_record.gift_count += gift_count
                    if gift_record.username != username:
                        gift_record.username = username
                else:
                    gift_record = cls(user_uid=user_uid, username=username, gift_count=gift_count)
                    db_session.add(gift_record)
                db_session.commit()
                return gift_record
            except Exception as e:
                db_session.rollback()
                if attempt < retries - 1:
                    logging.warning(f"Retrying due to error: {e}")
                else:
                    raise e

# 集成 gift_service.py 中的方法
class GiftService:
    @staticmethod
    def update_or_create(user_uid, username, gift_count):
        return GiftRanking.update_or_create(user_uid, username, gift_count)

    @staticmethod
    def get_gift_ranking(limit=20):
        return db_session.query(GiftRanking).order_by(GiftRanking.gift_count.desc()).limit(limit).all()

    @staticmethod
    def get_gift_record(user_uid):
        return db_session.query(GiftRanking).filter_by(user_uid=user_uid).first()

# 确保表存在
Base.metadata.create_all(engine)
TEST_ROOM_IDS = [1820703922]
SESSDATA="700a7692%2C1780578166%2Cef9be%2Ac2CjAqpC_JUQlMYu6PjAI788SKiKwo_06BHdJXpIIlHx4jY89Zrng1LBodVZApmYhYscMSVm44S0F4SEpPc0kyczlQYjZKY2lfbGoxTUVzd2RNZk9SVWdzSTBSd3NmdGFBcXVURE9ReHVMODZPZkxPeE5kbWF0MG9QRHRFeHUteUE0eERoamoyZk1nIIEC"

aiohttp_session: Optional[aiohttp.ClientSession] = None

def init_session():
    # 使用完整 Cookie 初始化
    cookies = http.cookies.SimpleCookie()
    cookies['SESSDATA'] = SESSDATA
    cookies['SESSDATA']['domain'] = 'bilibili.com'
    global aiohttp_session
    connector = aiohttp.TCPConnector(ssl=False)
    aiohttp_session = aiohttp.ClientSession(connector=connector)
    aiohttp_session.cookie_jar.update_cookies(cookies)

async def run_multi_clients():
    clients = [blivedm.BLiveClient(room_id, session=aiohttp_session) for room_id in TEST_ROOM_IDS]
    handler = MyHandler()
    for client in clients:
        client.set_handler(handler)
        client.start()
    try:
        await asyncio.gather(*(client.join() for client in clients))
    finally:
        await asyncio.gather(*(client.stop_and_close() for client in clients))

class MyHandler(blivedm.BaseHandler):
    def _on_heartbeat(self, client: blivedm.BLiveClient, message: web_models.HeartbeatMessage):
        pass
        
    def _on_danmaku(self, client: blivedm.BLiveClient, message: web_models.DanmakuMessage):
        pass

    def _on_gift(self, client: blivedm.BLiveClient, message: web_models.GiftMessage):
        if message.gift_name == "口水黄豆":
            try:
                GiftService.update_or_create(
                    user_uid=message.uid,
                    username=message.uname,
                    gift_count=message.num
                )
                logging.info(f"[{client.room_id}] {message.uname} 送了 {message.num} 个口水黄豆")
            except Exception as e:
                logging.error(f"处理礼物记录时出错: {e}")
        else:
            pass

    def _on_user_toast_v2(self, client: blivedm.BLiveClient, message: web_models.UserToastV2Message):
        pass

    def _on_super_chat(self, client: blivedm.BLiveClient, message: web_models.SuperChatMessage):
        pass

async def run_clients_loop():
    while True:
        try:
            await run_multi_clients()
        except Exception as e:
            logging.error(f"监听过程中出现异常: {e}")
        await asyncio.sleep(5)

async def main():
    init_session()
    try:
        await run_clients_loop()
    finally:
        if aiohttp_session:
            await aiohttp_session.close()

if __name__ == '__main__':
    asyncio.run(main())