from flask import Flask, render_template, request, session, redirect, url_for, send_file
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from werkzeug.security import check_password_hash, generate_password_hash
import zipfile
from app import create_app
from app.services.message_service import MessageService
# app = Flask(__name__)  这里用工厂模式，所以在__init__.py中已经创建了app
app=create_app()
app.secret_key = 'your_secret_key'

UPLOAD_FOLDER = 'uploads'
ZIP_FOLDER = 'zips'

for folder in [UPLOAD_FOLDER, ZIP_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

username = '别看了这里肯定不会写的'
hashed_password = generate_password_hash('虽然后台写了有这个但是这里肯定没有密码的啦')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/songs')
def songs():
    return render_template('songs.html')

@app.route('/box')
def box():
    return render_template('box.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        input_username = request.form['username']
        input_password = request.form['password']
        if input_username == username and check_password_hash(hashed_password, input_password):
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            error = '用户名或者密码错误'
            return render_template('login.html', error=error)
    return render_template('login.html')

@app.route('/admin')
def admin():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('admin.html')

@app.route('/admin/download')
def download_images():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    zip_filename = os.path.join(ZIP_FOLDER, 'images.zip')
    with zipfile.ZipFile(zip_filename, 'w') as zipf:
        for foldername, subfolders, filenames in os.walk(UPLOAD_FOLDER):
            for filename in filenames:
                filepath = os.path.join(foldername, filename)
                arcname = os.path.relpath(filepath, UPLOAD_FOLDER)
                zipf.write(filepath, arcname)
    
    return send_file(zip_filename, as_attachment=True)

@app.route('/admin/delete', methods=['GET'])
def delete_files():
    for folder_name in os.listdir(UPLOAD_FOLDER):
        folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
        if os.path.isdir(folder_path):
            for file_name in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file_name)
                os.remove(file_path)
            os.rmdir(folder_path)
    zip_files = [f for f in os.listdir() if f.endswith('.zip')]
    for zip_file in zip_files:
        os.remove(zip_file)

    return '', 204

@app.route('/upload', methods=['POST'])
def upload():
    # new_message = MessageService.create_message('guest_id', "message_text")
    # print("test success:",new_message.message_id)

    data = request.get_json()
    message = data.get('message', '')
    now = datetime.now()
    date_str = now.strftime('%Y%m%d')
    time_str = now.strftime('%H-%M-%S')
    filename = f"{date_str}-{time_str}.png"

    date_folder = os.path.join(UPLOAD_FOLDER, date_str)
    if not os.path.exists(date_folder):
        os.makedirs(date_folder)

    font_path = 'static/fonts/simfang.ttf'
    font = ImageFont.truetype(font_path, 20)

    image = Image.new('RGB', (1, 1), color='white')
    draw = ImageDraw.Draw(image)

    lines = [message[i:i + 29] for i in range(0, len(message), 29)]

    max_width = max(draw.textbbox((0, 0), line, font=font)[2] for line in lines) + 20
    total_height = sum(draw.textbbox((0, 0), line, font=font)[3] - draw.textbbox((0, 0), line, font=font)[1] for line in lines) + 20

    image = Image.new('RGB', (max_width, total_height), color='white')
    draw = ImageDraw.Draw(image)

    y_text = 10
    for line in lines:
        draw.text((10, y_text), line, fill='black', font=font)
        y_text += draw.textbbox((0, 0), line, font=font)[3] - draw.textbbox((0, 0), line, font=font)[1]

    image.save(os.path.join(date_folder, filename))

    return {'success': True}

@app.route('/message')
def message():
    # 这里可以替换成实际的对话框数据
    chat_data = [
        {'id': 1, 'title': '会话 1'},
        {'id': 2, 'title': '会话 2'},
        {'id': 3, 'title': '会话 3'},
        {'id': 4, 'title': '会话 4'}
    ]
    return render_template('message.html', chat_data=chat_data)
    # return render_template('message.html', dialogues=dialogues)

if __name__ == '__main__':
    app.run()
