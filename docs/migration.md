# 数据迁移与回滚说明

## 迁移目标
- 将历史提问箱数据迁移到新的 `core_message` 表结构。
- 保留图片文件并补齐缩略图。

## 新字段映射
| 旧字段 | 新字段 | 说明 |
| --- | --- | --- |
| id | message_id | 使用 UUID 或保留旧 ID 并写入 message_id |
| message | message_text | 原始留言正文 |
| tag | tag | 保持不变 |
| status | status | 统一为 active / archived / deleted |
| created_at | created_at | 原始创建时间 |
| ip | ip_address | 原始 IP |

## 迁移步骤
1. 备份数据库与原始图片文件夹。
2. 在新代码中执行迁移：
   ```bash
   python server/manage.py makemigrations
   python server/manage.py migrate
   ```
3. 导出旧表数据为 CSV 或 SQL。
4. 编写一次性导入脚本，将旧数据写入 `core_message` 表，并生成 UUID：
   - 可在 `server/scripts/migrate_messages.py` 中实现。
5. 对旧图片执行批量转换：
   - 将 PNG 透明通道转白底 JPG（80%）。
   - 生成 640px 缩略图并写入 `image_thumbnail` 字段。

## 回滚方案
- 回滚数据库：使用备份文件恢复至旧表。
- 回滚图片：恢复原始图片目录。
- 恢复旧服务前，停止新服务，确认 Nginx 反向代理指向旧后端。
