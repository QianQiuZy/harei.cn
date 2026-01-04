CREATE DATABASE IF NOT EXISTS harei_cn; 
USE harei_cn;

CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT, -- 留言唯一ID
    guest_id VARCHAR(255) NOT NULL, -- 用于区分不同访客的唯一标识符
    message_text TEXT, -- 留言的文字内容
    tag VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'approved', 'archived') DEFAULT 'pending', -- 留言状态
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 留言创建时间
);

CREATE TABLE images (
    image_id INT PRIMARY KEY AUTO_INCREMENT, -- 图片唯一ID
    message_id INT, -- 关联的留言ID
    image_path VARCHAR(255) NOT NULL, -- 图片的存储路径或 URL
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 图片上传时间
    FOREIGN KEY (message_id) REFERENCES messages (message_id) ON DELETE CASCADE -- 留言删除时，相关图片也删除
);

CREATE TABLE music (
    music_id INT PRIMARY KEY AUTO_INCREMENT,  -- 唯一标识符
    title VARCHAR(255) NOT NULL,              -- 音乐名称
    artist VARCHAR(255) NOT NULL,             -- 艺术家
    type VARCHAR(50),                         -- 音乐类型（可选）
    language VARCHAR(50),                     -- 语言（可选）
    note TEXT                                -- 备注（可选）
);

CREATE TABLE gift_ranking (
    ADD COLUMN username VARCHAR(255) DEFAULT NULL;
    user_uid VARCHAR(255) PRIMARY KEY,       -- 用户唯一UID
    gift_count INT DEFAULT 0                 -- 口水黄豆礼物的数量
);

CREATE TABLE tags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(255) NOT NULL UNIQUE,  -- TAG名称，唯一
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);