# 花礼harei的网站

> 此网站已完全重构，此项目已废弃，仅保留记录

> 重构后前端：`https://github.com/qianqiuzy/harei-frontend`

> 重构后后端：`https://github.com/qianqiuzy/harei-backend`

### 说明
心血来潮的一个小项目，求开发求开发求开发，缺人缺人缺人，想加入开发B站私聊我即可。

已配置公网可直接访问，手机或电脑浏览器输入[harei.cn](https://harei.cn)即可。

如果发现错误或有改进建议，欢迎提Issue，或者直接在[B站](https://space.bilibili.com/351708822)私信我。

第三方API引用：api.live.bilibili.com/room/v1/Room/get_info （用于获取直播间开播状态）

PS：如果看到这里了请点个star吧谢谢了喵~

PPS：本来想写网站里但是觉得无所谓（？）别乱搞，乱搞会被关小黑屋哦

PPPS：感谢三位开发大佬的付出

### 部署方式（直接部署）

1. 克隆仓库：
   ```bash
   git clone https://github.com/QianQiuZy/harei.cn
   ```

2. 后端依赖安装：
   ```bash
   pip install -r server/requirements.txt
   ```

3. 配置环境变量：
   ```bash
   cp .env.example .env
   ```

4. 初始化数据库：
   ```bash
   python server/manage.py migrate
   ```

5. 构建前端：
   ```bash
   cd frontend
   npm install
   npm run build
   ```

6. 启动后端服务：
   ```bash
   python server/manage.py runserver 0.0.0.0:8000
   ```

### 作者主页

[千秋紫莹](https://space.bilibili.com/351708822)

### 开发人员感谢

[しぐれそら](https://space.bilibili.com/16547)

[米凯拉的锋刃z](https://space.bilibili.com/4328663)

[夜丶阑雨](https://space.bilibili.com/254086959)

### 测试人员感谢

待加

### 费用公开

腾讯云香港区2H2G20M服务器 400/年

网站租赁费用 33/年

COS对象存储服务器 估算50/年

给花礼的舰长礼物和SC（？）
