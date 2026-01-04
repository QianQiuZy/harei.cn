# 直播间监听服务

该服务独立于 Django 运行，用于接收直播开播/下播、上舰与礼物事件。

## 运行方式
```bash
export BILI_ROOM_ID=123456
export BILI_IDENTITY_CODE=your_identity_code
python server/services/live_listener.py
```

## 输出内容
- 开播/下播事件：控制台输出直播间状态变更。
- 上舰事件：输出用户名与舰长等级。
- SC/礼物事件：输出用户名与内容。

## 二次开发建议
- 将事件写入数据库模型 `CaptainEvent` 与 `GiftRecord`。
- 对接 Excel 导出时可复用 `pandas` 或 `openpyxl`。
