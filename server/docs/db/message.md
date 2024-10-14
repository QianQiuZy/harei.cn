### `Messages` 表

| 字段名       | 类型            | 描述               |
|--------------|-----------------|--------------------|
| `message_id` | INT PRIMARY KEY  | 留言唯一 ID        |
| `guest_id`   | VARCHAR(255)     | 匿名访客标识       |
| `message_text` | TEXT           | 留言内容           |
| `created_at` | TIMESTAMP        | 留言创建时间       |

### `Images` 表

| 字段名       | 类型            | 描述               |
|--------------|-----------------|--------------------|
| `image_id`   | INT PRIMARY KEY  | 图片唯一 ID        |
| `message_id` | INT              | 关联的留言 ID      |
| `image_path` | VARCHAR(255)     | 图片文件存储路径   |
| `uploaded_at` | TIMESTAMP       | 图片上传时间       |

## 数据库关系

- `Messages` 表和 `Images` 表通过 `message_id` 进行一对多关联。一次留言对应一个message与若干个image。
- 用户每次提交带有图片的留言，后端在messages里生成一个新的表项，在images里生成若干个新的表项。
