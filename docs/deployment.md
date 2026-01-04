# 部署与运行说明

## 本地开发
1. 安装后端依赖：
   ```bash
   pip install -r server/requirements.txt
   ```
2. 初始化数据库：
   ```bash
   python server/manage.py migrate
   ```
3. 构建前端：
   ```bash
   cd frontend
   npm install
   npm run build
   ```
4. 启动后端：
   ```bash
   python server/manage.py runserver
   ```

## Docker 方式
1. 复制环境变量：
   ```bash
   cp .env.example .env
   ```
2. 构建并启动：
   ```bash
   docker compose up --build
   ```
3. 访问：
   - 后端：`http://localhost:8000/api/`
   - 管理后台：`http://localhost:8000/admin/`

## Nginx 与静态资源
- Docker 配置仅包含后端服务，Nginx 由外部单独部署与配置。
- 首页背景图放置在 `server/static/backgrounds`，文件统一使用 `.jpg` 格式（例如 `slide-1.jpg`）。
