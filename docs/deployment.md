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
   - 前端：`http://localhost`
   - 后端：`http://localhost/api/`
   - 管理后台：`http://localhost/admin/`
