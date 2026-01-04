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
    "礼礼不冲",
    "礼礼不C",
    "花礼花蕊",
    "礼礼不窜",
    "llbc",
    "我才不是串子呢",
    "75毫米的大唧吧",
    "花札哈雷",
    "黄山迎客松",
    "鼠今色",
    "扒开看户型！",
    "看看我的迎客松",
    "玩网姐，唯有敬佩"
];

// 随机选择一个文字并展示
document.addEventListener("DOMContentLoaded", function() {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('randomText').textContent = `"${randomText}"`;
});