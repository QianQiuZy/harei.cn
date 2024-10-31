import requests
import threading

# 用于存储直播状态和开播时间
live_status = {
    'status': 0,       # 默认状态为未直播
    'live_time': None  # 默认无开播时间
}

# 获取直播状态的函数
def fetch_live_status():
    url = 'https://api.live.bilibili.com/room/v1/Room/get_info?room_id=1820703922'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": "*"  # 只需要cookie内的SESSDATA项发请求即可，不需要其他项
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    data = response.json().get("data", {})
    live_status['status'] = data.get("live_status", 0)
    live_status['live_time'] = data.get("live_time") if live_status['status'] == 1 else None

# 定时器，每隔三分钟调用一次
def schedule_fetch_live_status():
    fetch_live_status()
    threading.Timer(180, schedule_fetch_live_status).start()  # 180秒即3分钟

# 启动定时器
schedule_fetch_live_status()
