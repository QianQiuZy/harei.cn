function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const iconItems = sidebar.querySelectorAll('.icon-item');

    sidebar.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
        overlay.style.display = 'block';

        iconItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`; // 为每个文本项设置延迟
        });
    } else {
        overlay.style.display = 'none';
        iconItems.forEach(item => {
            item.style.animationDelay = '0s'; // 关闭时重置延迟
            item.style.opacity = '0'; // 立即隐藏文本
            item.style.transform = 'translateX(-20px)'; // 立即移回
        });
    }
}

document.getElementById('search').addEventListener('input', filterSongs);
document.getElementById('artist-select').addEventListener('change', filterSongs);
document.getElementById('genre-select').addEventListener('change', filterSongs);
document.getElementById('language-select').addEventListener('change', filterSongs);

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

document.getElementById('submit').addEventListener('click', submitMessage);

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
