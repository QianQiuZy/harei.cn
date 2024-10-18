# /app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# 创建 SQLAlchemy 实例
db = SQLAlchemy()


def create_app():
    # print(__name__)
    app = Flask(__name__)

    # 配置数据库 URI（例如 SQLite、MySQL、PostgreSQL）
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "mysql+pymysql://harei:hareillbc0301@localhost:3306/harei"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = "/www/wwwroot/harei/server/uploads"

    # 将 SQLAlchemy 绑定到 Flask 应用
    db.init_app(app)

    with app.app_context():
        db.create_all()  # 自动创建所有定义的表（如果不存在）

    return app
