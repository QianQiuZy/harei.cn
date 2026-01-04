"""B站直播间监听服务（独立运行）。"""
from __future__ import annotations

import asyncio
import os
from dataclasses import dataclass

import blivedm
from blivedm import BaseHandler


@dataclass
class LiveConfig:
    room_id: int
    identity_code: str


class LiveEventHandler(BaseHandler):
    async def _on_room_change(self, client, message):
        print(f"直播间状态变更: {message}")

    async def _on_super_chat(self, client, message):
        print(f"SC: {message.user_name} {message.message}")

    async def _on_guard_buy(self, client, message):
        print(f"上舰: {message.username} 等级 {message.guard_level}")


async def run_listener(config: LiveConfig) -> None:
    client = blivedm.BLiveClient(config.room_id, session_cookie=config.identity_code)
    handler = LiveEventHandler()
    client.add_handler(handler)
    await client.start()

    try:
        await client.join()
    finally:
        await client.stop_and_close()


if __name__ == "__main__":
    room_id = int(os.getenv("BILI_ROOM_ID", "0"))
    identity_code = os.getenv("BILI_IDENTITY_CODE", "")
    if not room_id or not identity_code:
        raise SystemExit("需要设置 BILI_ROOM_ID 和 BILI_IDENTITY_CODE")

    asyncio.run(run_listener(LiveConfig(room_id=room_id, identity_code=identity_code)))
