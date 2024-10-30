from flask import (
    Flask,
    jsonify,
    render_template,
    request,
    session,
    redirect,
    url_for,
    send_from_directory,
)
import os
from werkzeug.security import check_password_hash, generate_password_hash
from app import create_app
from app.services.message_service import MessageService
from app.services.images_service import ImageService
from app.services.music_service import MusicService
from app.api.livestatus import fetch_live_status

# app = Flask(__name__)  这里用工厂模式，所以在__init__.py中已经创建了app
app = create_app()
app.secret_key = "your_secret_key"

UPLOAD_FOLDER = "server/uploads"

for folder in [UPLOAD_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

username = "00000"
hashed_password = generate_password_hash("00000")


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
            return redirect(url_for("message"))
        else:
            error = "用户名或者密码错误"
            return render_template("login.html", error=error)
    return render_template("login.html")

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

    uploaded_image_paths = []

    # 处理多张图片上传
    if files:
        for key, image in files.items():
            # 使用安全的文件名（防止路径注入等风险）
            original_filename = image.filename

            # 首先在数据库中创建一条记录，image_path 先设为空
            new_image = ImageService.create_image(
                message_id=new_message.message_id, image_path=""
            )

            # 生成基于 image_id 的文件名，确保唯一性
            image_filename = f"image_{new_image.image_id}_{original_filename}"
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], image_filename)

            # 保存图片到服务器文件夹
            image.save(image_path)
            print(f"Saved image to {image_path}")

            # 更新数据库中的 image_path 字段
            # new_image.image_path = image_path

            ImageService.update_image(image_id=new_image.image_id, image_path=image_path)
            # db.session.commit()  # 提交更新

            # 记录上传的图片路径
            uploaded_image_paths.append(image_path)

    # 返回成功响应，哪怕没有上传图片
    return jsonify({
        "success": True,
        "message_id": new_message.message_id,
        "uploaded_images": uploaded_image_paths
    })


@app.route("/uploads/<filename>", methods=["GET"])
def uploaded_file(filename):
    # 获取 uploads 目录的路径：使用 ../ 从 app.config['UPLOAD_FOLDER'] 的父目录中访问 uploads 文件夹
    uploads_path = os.path.abspath(
        os.path.join(app.config["UPLOAD_FOLDER"], "../uploads")
    )
    # uploads_path = app.config["UPLOAD_FOLDER"]

    # 打印调试信息
    print("Serving file from directory:", uploads_path)

    # 使用 send_from_directory 从指定目录中发送文件
    return send_from_directory(uploads_path, filename)

@app.route("/audit")
def audit():
    if not session.get("logged_in"):
        return redirect(url_for("login"))

    # 获取所有待审核的消息
    pending_messages = MessageService.get_pending_messages()

    # 构造 chat_data 列表，每个消息包含 id、title（消息文本）、images（与消息相关联的所有图片）
    chat_data = []
    for msg in pending_messages:
        # 获取与该消息相关联的所有图片
        images = ImageService.get_images_by_message_id(msg.message_id)

        # 如果有图片，将所有图片路径添加到列表中；如果没有，则使用默认图片
        if images:
            image_urls = [image.image_path.replace('/www/wwwroot/harei/server/', '') for image in images]
            print(image_urls)
        else:
            image_urls = []  # 使用占位符图片

        # 构造消息字典并添加到 chat_data 列表中
        chat_data.append(
            {
                "id": msg.message_id,
                "date": msg.created_at,
                "msg": msg.message_text,
                "title": msg.message_text[:20],  # 使用消息内容的前 20 个字符作为标题
                "images": image_urls,  # 保存所有图片路径
            }
        )

    # 将数据传递给模板
    return render_template("audit.html", chat_data=chat_data)

@app.route('/audit/approve/<int:message_id>', methods=['POST'])
def approve_message(message_id):
    # 审核通过，将状态更新为 'approved'
    MessageService.update_message_status(message_id, 'approved')
    return jsonify({"message": "消息已通过审核"}), 200

@app.route('/audit/reject/<int:message_id>', methods=['POST'])
def reject_message(message_id):
    # 删除未通过的留言
    MessageService.delete_message(message_id)
    return jsonify({"message": "消息已删除"}), 200

@app.route('/archive', methods=['POST'])
def archive_all_messages():
    # 获取所有状态为 'approved' 的消息，并将它们状态更新为 'archived'
    messages_to_archive = MessageService.get_approved_messages()
    for message in messages_to_archive:
        MessageService.update_message_status(message.message_id, 'archived')
    # 返回 JSON 响应
    return jsonify({'message': f'{len(messages_to_archive)} 条消息已归档'})


@app.route("/message")
def message():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    messages = MessageService.get_approved_messages()

    # 构造 chat_data 列表，每个消息包含 id、title（消息文本）、images（与消息相关联的所有图片）
    chat_data = []
    for msg in messages:
        # 获取与该消息相关联的所有图片
        images = ImageService.get_images_by_message_id(msg.message_id)

        # 如果有图片，将所有图片路径添加到列表中；如果没有，则使用默认图片
        if images:
            image_urls = [image.image_path.replace('/www/wwwroot/harei/server/', '') for image in images]
            print(image_urls)
        else:
            image_urls = []  # 使用占位符图片

        # 构造消息字典并添加到 chat_data 列表中
        chat_data.append(
            {
                "id": msg.message_id,
                "date": msg.created_at,
                "msg": msg.message_text,
                "title": msg.message_text[:20],  # 使用消息内容的前 20 个字符作为标题
                "images": image_urls,  # 保存所有图片路径
            }
        )

    # 将数据传递给模板
    return render_template("message.html", chat_data=chat_data)

@app.route("/hostindex")
def hostindex():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    # 将数据传递给模板
    return render_template("hostindex.html")

@app.route("/hostsongs")
def hostsongs():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    # 将数据传递给模板
    return render_template("hostsongs.html")


@app.route("/addmusic")
def testadd():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    # 将数据传递给模板
    return render_template("addmusic.html")

@app.route('/music', methods=['GET'])
def get_all_music():
    """
    获取所有音乐，并以 JSON 格式返回
    """
    music_list = MusicService.get_all_music()  # 从 MusicService 获取所有音乐
    # 将音乐对象转换为可序列化的 JSON 格式
    music_data = []

    for music in music_list:
        music_data.append({
            'music_id': music.music_id,
            'title': music.title,
            'artist': music.artist,
            'type': music.type,  # 添加类型字段
            'language': music.language,  # 添加语言字段
            'note': music.note  # 添加备注字段
        })
    
    # 返回 JSON 响应
    return (music_data), 200


@app.route('/add-music', methods=['POST'])
def add_music():
    """
    处理前端提交的歌曲信息，并存储到数据库
    """
    data = request.get_json()

    # 获取前端提交的字段
    title = data.get('title')
    artist = data.get('artist')
    type_ = data.get('type', None)  # 获取类型字段
    language = data.get('language', None)  # 获取语言字段
    note = data.get('note', None)  # 获取备注字段

    # 检查必填字段是否填写
    if not title or not artist:
        return ({'success': False, 'message': '缺少必填字段'}), 400

    # 使用 MusicService 创建新歌曲
    new_music = MusicService.create_music(
        title=title,
        artist=artist,
        type=type_,  # 添加类型字段
        language=language,  # 添加语言字段
        note=note  # 添加备注字段
    )

    return ({'success': True, 'music_id': new_music.music_id}), 200

@app.route("/livestatus", methods=["GET"])
def live_status():
    try:
        status = fetch_live_status()
        return jsonify({"live_status": "直播中" if status == 1 else "未直播"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
