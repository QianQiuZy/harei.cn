CREATE DATABASE IF NOT EXISTS harei_cn;
USE harei_cn;

CREATE TABLE
    Messages (
        message_id INT PRIMARY KEY AUTO_INCREMENT, -- 留言唯一ID
        guest_id VARCHAR(255) NOT NULL, -- 用于区分不同访客的唯一标识符
        message_text TEXT, -- 留言的文字内容
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 留言创建时间
    );

CREATE TABLE
    Images (
        image_id INT PRIMARY KEY AUTO_INCREMENT, -- 图片唯一ID
        message_id INT, -- 关联的留言ID
        image_path VARCHAR(255) NOT NULL, -- 图片的存储路径或 URL
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 图片上传时间
        FOREIGN KEY (message_id) REFERENCES Messages (message_id) ON DELETE CASCADE -- 留言删除时，相关图片也删除
    );
