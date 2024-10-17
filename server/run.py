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

# app = Flask(__name__)  这里用工厂模式，所以在__init__.py中已经创建了app
app = create_app()
app.secret_key = "your_secret_key"

UPLOAD_FOLDER = "server/uploads"

for folder in [UPLOAD_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

username = "harei"
hashed_password = generate_password_hash("hareillbc0301")


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

    # 处理多张图片上传
    if not files:
        return ({"success": False, "error": "At least one image is required."}), 400

    uploaded_image_paths = []
    for key, image in files.items():
        # 生成保存图片的路径
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
        print(os.getcwd())
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
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    messages = MessageService.get_all_messages()

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
                "title": msg.message_text[:20],  # 使用消息内容的前 20 个字符作为标题
                "images": image_urls,  # 保存所有图片路径
            }
        )

    # 将数据传递给模板
    return render_template("message.html", chat_data=chat_data)


@app.route("/musicadd")
def testadd():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    # 将数据传递给模板

@app.route("/addmusic")
def addmusic():
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
        print(music)
        music_data.append({
            'music_id': music.music_id,
            'title': music.title,
            'artist': music.artist,
            'album': music.album,
            'release_date': music.release_date.strftime('%Y-%m-%d') if music.release_date else None,
            'duration': music.duration,
            'type': music.type,  # 添加类型字段
            'language': music.language,  # 添加语言字段
            'note': music.note,  # 添加备注字段
            'created_at': music.created_at.strftime('%Y-%m-%d %H:%M:%S')
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
    album = data.get('album', None)
    release_date = data.get('release_date')
    duration = data.get('duration')
    type_ = data.get('type', None)  # 获取类型字段
    language = data.get('language', None)  # 获取语言字段
    note = data.get('note', None)  # 获取备注字段

    # 检查必填字段是否填写
    if not title or not artist or not release_date or not duration:
        return ({'success': False, 'message': '缺少必填字段'}), 400

    # 使用 MusicService 创建新歌曲
    new_music = MusicService.create_music(
        title=title,
        artist=artist,
        album=album,
        release_date=release_date,
        duration=int(duration),  # 确保 duration 是整数
        type=type_,  # 添加类型字段
        language=language,  # 添加语言字段
        note=note  # 添加备注字段
    )

    return ({'success': True, 'music_id': new_music.music_id}), 200

if __name__ == "__main__":
    app.run(port=5000)

