from flask import (
    Flask,
    render_template,
    request,
    session,
    redirect,
    url_for,
    send_file,
    send_from_directory,
)
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from werkzeug.security import check_password_hash, generate_password_hash
import zipfile
from app import create_app
from app.services.message_service import MessageService
from app.services.images_service import ImageService

# app = Flask(__name__)  这里用工厂模式，所以在__init__.py中已经创建了app
app = create_app()
app.secret_key = "your_secret_key"

UPLOAD_FOLDER = "uploads"
ZIP_FOLDER = "zips"

for folder in [UPLOAD_FOLDER, ZIP_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

username = "别看了这里肯定不会写的"
hashed_password = generate_password_hash("虽然后台写了有这个但是这里肯定没有密码的啦")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/songs")
def songs():
    return render_template("songs.html")


@app.route("/box")
def box():
    return render_template("box.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        input_username = request.form["username"]
        input_password = request.form["password"]
        if input_username == username and check_password_hash(
            hashed_password, input_password
        ):
            session["logged_in"] = True
            return redirect(url_for("admin"))
        else:
            error = "用户名或者密码错误"
            return render_template("login.html", error=error)
    return render_template("login.html")


@app.route("/admin")
def admin():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    return render_template("admin.html")


@app.route("/admin/download")
def download_images():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    zip_filename = os.path.join(ZIP_FOLDER, "images.zip")
    with zipfile.ZipFile(zip_filename, "w") as zipf:
        for foldername, subfolders, filenames in os.walk(UPLOAD_FOLDER):
            for filename in filenames:
                filepath = os.path.join(foldername, filename)
                arcname = os.path.relpath(filepath, UPLOAD_FOLDER)
                zipf.write(filepath, arcname)

    return send_file(zip_filename, as_attachment=True)


@app.route("/admin/delete", methods=["GET"])
def delete_files():
    for folder_name in os.listdir(UPLOAD_FOLDER):
        folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
        if os.path.isdir(folder_path):
            for file_name in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file_name)
                os.remove(file_path)
            os.rmdir(folder_path)
    zip_files = [f for f in os.listdir() if f.endswith(".zip")]
    for zip_file in zip_files:
        os.remove(zip_file)

    return "", 204


@app.route("/upload", methods=["POST"])
def upload():
    # 获取留言文本
    message_text = request.form.get("message")
    files = request.files  # 获取上传的文件

    # 处理文本
    if not message_text:
        return jsonify({"success": False, "error": "Message text is required."}), 400

    # 创建并保存留言
    guest_id = "guest123"  # 假设是固定的访客ID，可以根据具体需求动态生成
    new_message = MessageService.create_message(
        guest_id=guest_id, message_text=message_text
    )
    print(f"Message saved successfully with ID: {new_message.message_id}")

    # 处理多张图片上传
    if not files:
        return ({"success": False, "error": "At least one image is required."}), 400

    uploaded_image_paths = []
    for key, image in files.items():
        # 生成保存图片的路径
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
        # 保存图片到服务器文件夹
        image.save(image_path)
        print(f"Saved image to {image_path}")
        # 保存图片记录到数据库，关联到刚创建的消息
        ImageService.create_image(
            message_id=new_message.message_id, image_path=image_path
        )
        uploaded_image_paths.append(image_path)

    # 返回成功响应
    return {
        "success": True,
        "message_id": new_message.message_id,
        "uploaded_images": uploaded_image_paths,
    }


@app.route("/uploads/<filename>", methods=["GET"])
def uploaded_file(filename):
    # 获取 uploads 目录的路径：使用 ../ 从 app.config['UPLOAD_FOLDER'] 的父目录中访问 uploads 文件夹
    uploads_path = os.path.abspath(
        os.path.join(app.config["UPLOAD_FOLDER"], "../uploads")
    )

    # 打印调试信息
    print("Serving file from directory:", uploads_path)

    # 使用 send_from_directory 从指定目录中发送文件
    return send_from_directory(uploads_path, filename)


@app.route("/message")
def message():
    messages = MessageService.get_all_messages()

    # 构造 chat_data 列表，每个消息包含 id、title（消息文本）、images（与消息相关联的所有图片）
    chat_data = []
    for msg in messages:
        # 获取与该消息相关联的所有图片
        images = ImageService.get_images_by_message_id(msg.message_id)

        # 如果有图片，将所有图片路径添加到列表中；如果没有，则使用默认图片
        if images:
            image_urls = [image.image_path for image in images]  # 获取所有图片的路径
        else:
            image_urls = [
                "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"
            ]  # 使用占位符图片

        # 构造消息字典并添加到 chat_data 列表中
        chat_data.append(
            {
                "id": msg.message_id,
                "title": msg.message_text[:20],  # 使用消息内容的前 20 个字符作为标题
                "images": image_urls,  # 保存所有图片路径
            }
        )

    # 将数据传递给模板
    return render_template("message.html", chat_data=chat_data)


if __name__ == "__main__":
    app.run()

    # chat_data = [
    #     {'id': 1, 'title': '会话 1', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 2, 'title': '会话 2', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 3, 'title': '会话 3', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 4, 'title': '会话 4', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 5, 'title': '会话 5', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 6, 'title': '会话 6', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 7, 'title': '会话 7', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 8, 'title': '会话 8', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 9, 'title': '会话 9', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 10, 'title': '会话 10', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 11, 'title': '会话 11', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 12, 'title': '会话 12', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 13, 'title': '会话 13', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 14, 'title': '会话 14', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 15, 'title': '会话 15', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 16, 'title': '会话 16', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 17, 'title': '会话 17', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'},
    #     {'id': 18, 'title': '会话 18', 'image': 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'}
    # ]
