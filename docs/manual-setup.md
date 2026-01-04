# 手动部署需要准备的文件

首次 Docker 部署后，需要确保以下文件/目录存在并挂载：

## 必备文件
- `.env`：环境变量配置（可由 `.env.example` 复制生成）。
- `server/uploads/`：上传目录（用于保存用户图片与缩略图）。
- `server/static/backgrounds/`：背景轮播资源目录（请放置 `.jpg` 文件）。

## 可选文件
- `server/static/frontend/`：前端构建产物（由前端构建生成）。
- `server/static/`：自定义静态资源（图标、样式等）。

## 说明
- `backgrounds` 目录内的文件建议命名为 `slide-1.jpg`、`slide-2.jpg` 等，并确保与前端配置一致。
- 若未上传背景图，前端将出现空白背景或 404 请求。
