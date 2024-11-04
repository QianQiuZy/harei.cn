function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const iconItems = sidebar.querySelectorAll('.icon-item');

    sidebar.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
        overlay.style.display = 'block';

        // 为每个文本项设置延迟
        iconItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // 添加点击事件监听器，点击非边栏区域时收起边栏
        setTimeout(() => {
            document.addEventListener('click', closeSidebarOnOutsideClick);
        }, 0); // 延迟添加事件监听器，避免立即触发关闭
    } else {
        closeSidebar();
    }
}

// 定义关闭边栏的函数
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const iconItems = sidebar.querySelectorAll('.icon-item');

    overlay.style.display = 'none';
    sidebar.classList.remove('open');

    // 重置延迟并隐藏文本项
    iconItems.forEach(item => {
        item.style.animationDelay = '0s';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
    });

    // 移除全局点击事件监听器
    document.removeEventListener('click', closeSidebarOnOutsideClick);
}

// 点击非边栏区域时关闭边栏
function closeSidebarOnOutsideClick(event) {
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menu-icon'); // 假设打开边栏的按钮有这个ID

    // 检查点击是否发生在 sidebar、overlay 或菜单按钮上
    if (!sidebar.contains(event.target) && event.target !== menuButton) {
        closeSidebar();
    }
}

function filterSongs() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const artistValue = document.getElementById('artist-select').value;
    const genreValue = document.getElementById('genre-select').value;
    const languageValue = document.getElementById('language-select').value;

    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => {
        const songName = row.children[0].innerText.toLowerCase();
        const artist = row.children[1].innerText.toLowerCase();
        const genre = row.children[2].innerText.toLowerCase();
        const language = row.children[3].innerText.toLowerCase();

        const matchesSearch = songName.includes(searchValue) || artist.includes(searchValue);
        const matchesArtist = artistValue === '' || artist === artistValue;
        const matchesGenre = genreValue === '' || genre === genreValue;
        const matchesLanguage = languageValue === '' || language === languageValue;

        if (matchesSearch && matchesArtist && matchesGenre && matchesLanguage) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// document.getElementById('submit').addEventListener('click', submitMessage);

function submitMessage() {
    const message = document.getElementById('message').value;

    if (message.trim() === '') {
        alert('请输入您的秘密！'); // 如果输入为空，提示用户
        return;
    }

    // 假设你的服务器端有一个处理 POST 请求的 API
    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
        .then(response => {
            if (response.ok) {
                alert('提交成功！');
                document.getElementById('message').value = ''; // 清空输入框
            } else {
                alert('提交失败，请重试。');
            }
        })
        .catch(error => {
            console.error('错误:', error);
            alert('发生错误，请重试。');
        });
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('/static/components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
        });
});


document.addEventListener("DOMContentLoaded", function() {
    fetch('/static/components/host-sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('host-sidebar-container').innerHTML = data;
        });
});

// 随机文字列表
const texts = [
    "礼礼不串",
    "llbc",
    "你好我是花礼harei",
    "我才不是串子呢",
    "CUTE~"
];

// 随机选择一个文字并展示
document.addEventListener("DOMContentLoaded", function() {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('randomText').textContent = `"${randomText}"`;
});

function updateLiveStatus(data) {
    const liveStatusElement = document.getElementById("liveStatus");
    
    if (data.status === 1 && data.live_time) {
        const liveStartTime = new Date(data.live_time);  // 将开播时间转换为 Date 对象
        liveStatusElement.textContent = "已开播 00:00:00";

        // 每秒更新已开播时长
        setInterval(() => {
            const now = new Date();
            const diffInSeconds = Math.floor((now - liveStartTime) / 1000);

            const hours = Math.floor(diffInSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((diffInSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (diffInSeconds % 60).toString().padStart(2, '0');

            liveStatusElement.textContent = `已开播 ${hours}:${minutes}:${seconds}`;
        }, 1000);

    } else {
        liveStatusElement.textContent = "未开播";
    }
}

// 从后端获取直播状态
function fetchLiveStatus() {
    fetch('/livestatus')
        .then(response => response.json())
        .then(data => updateLiveStatus(data))
        .catch(error => console.error('获取直播状态失败:', error));
}

// 初始加载和定时更新
fetchLiveStatus();
setInterval(fetchLiveStatus, 60000); // 每3分钟更新一次状态