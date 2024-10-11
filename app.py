from flask import Flask, render_template, request, session, redirect, url_for, send_file
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from werkzeug.security import check_password_hash, generate_password_hash
import zipfile

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 用于加密 session

UPLOAD_FOLDER = 'uploads'  # 存储上传图片的文件夹
ZIP_FOLDER = 'zips'  # 存储打包zip文件的文件夹

# 创建文件夹（如果不存在）
for folder in [UPLOAD_FOLDER, ZIP_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# 登录账户名和加密后的密码
username = 'harei'
hashed_password = generate_password_hash('Hareillbc0301')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/songs')
def songs():
    return render_template('songs.html')

@app.route('/box')
def box():
    return render_template('box.html')

# 登录路由
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        input_username = request.form['username']
        input_password = request.form['password']
        if input_username == username and check_password_hash(hashed_password, input_password):
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            error = '用户名或者密码错误'  # 设置错误信息
            return render_template('login.html', error=error)  # 将错误信息传递给模板
    return render_template('login.html')

# 管理页面路由
@app.route('/admin')
def admin():
    if not session.get('logged_in'):
        return redirect(url_for('login'))  # 未登录则重定向到登录页面
    return render_template('admin.html')

# 打包并下载图片的路由
@app.route('/admin/download')
def download_images():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    zip_filename = os.path.join(ZIP_FOLDER, 'images.zip')

    # 打包所有图片为zip文件
    with zipfile.ZipFile(zip_filename, 'w') as zipf:
        for foldername, subfolders, filenames in os.walk(UPLOAD_FOLDER):
            for filename in filenames:
                filepath = os.path.join(foldername, filename)
                arcname = os.path.relpath(filepath, UPLOAD_FOLDER)
                zipf.write(filepath, arcname)
    
    return send_file(zip_filename, as_attachment=True)

# 删除缓存图片和zip文件的路由
@app.route('/admin/delete', methods=['GET'])
def delete_files():
    # 获取上传文件夹中的所有文件并删除
    for folder_name in os.listdir(UPLOAD_FOLDER):
        folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
        if os.path.isdir(folder_path):
            # 删除文件夹中的所有文件
            for file_name in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file_name)
                os.remove(file_path)
            # 删除文件夹
            os.rmdir(folder_path)
    
    # 如果有 zip 文件，则删除它们
    zip_files = [f for f in os.listdir() if f.endswith('.zip')]
    for zip_file in zip_files:
        os.remove(zip_file)

    return '', 204  # 返回204 No Content表示删除成功

@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()
    message = data.get('message', '')

    # 获取当前日期和时间
    now = datetime.now()
    date_str = now.strftime('%Y%m%d')
    time_str = now.strftime('%H-%M-%S')  # 使用短横线替代冒号
    ip_address = request.remote_addr  # 获取客户端的IP地址
    filename = f"{date_str}-{time_str}-{ip_address}.png"
    
    # 创建日期文件夹
    date_folder = os.path.join(UPLOAD_FOLDER, date_str)
    if not os.path.exists(date_folder):
        os.makedirs(date_folder)

    # 使用支持中文的字体
    font_path = 'static/fonts/simfang.ttf'  # 确保将字体文件放在 static/fonts 目录
    font = ImageFont.truetype(font_path, 20)  # 加载字体，设置字号

    # 创建图像并绘制文本
    image = Image.new('RGB', (1, 1), color='white')  # 创建一个小图像以获取字体大小
    draw = ImageDraw.Draw(image)

    # 将文本分为每29个字符一行
    lines = [message[i:i + 29] for i in range(0, len(message), 29)]

    # 计算图像的宽度和高度
    max_width = max(draw.textbbox((0, 0), line, font=font)[2] for line in lines) + 20  # 加上边距
    total_height = sum(draw.textbbox((0, 0), line, font=font)[3] - draw.textbbox((0, 0), line, font=font)[1] for line in lines) + 20  # 计算总高度加上边距

    # 创建实际图像并绘制文本
    image = Image.new('RGB', (max_width, total_height), color='white')  # 创建白色背景的图像
    draw = ImageDraw.Draw(image)

    # 绘制所有行
    y_text = 10
    for line in lines:
        draw.text((10, y_text), line, fill='black', font=font)
        y_text += draw.textbbox((0, 0), line, font=font)[3] - draw.textbbox((0, 0), line, font=font)[1]  # 移动到下一行

    # 保存图像
    image.save(os.path.join(date_folder, filename))

    return {'success': True}

if __name__ == '__main__':
    app.run(debug=True)


