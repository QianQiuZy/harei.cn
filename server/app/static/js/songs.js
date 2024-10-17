document.addEventListener('DOMContentLoaded', function() {
    // 用于存储所有歌曲数据的全局变量
    let songsData = [];

    // 从服务器获取歌曲数据
    fetch('/music')
        .then(response => {
            console.log('响应状态:', response.status);  // 检查响应状态
            return response.json();
        })
        .then(data => {
            console.log('获取到的数据:', data);  // 输出获取到的歌曲数据
            songsData = data; // 存储数据以便后续筛选
            displaySongs(songsData); // 页面加载时显示所有歌曲
        })
        .catch(error => console.error('获取歌曲数据出错:', error));

    // 显示歌曲的函数
    function displaySongs(songsToDisplay) {
        const songTableContent = document.getElementById('song-table-content');
        songTableContent.innerHTML = '';  // 清空旧数据

        // 循环遍历每首歌曲并创建相应的行
        songsToDisplay.forEach(song => {
            const row = document.createElement('div');
            row.classList.add('table-row');
            console.log(song);
            row.innerHTML = `
                <span class="title">${song.title}</span>
                <span class="artist">${song.artist}</span>
                <span class="type">${song.type || '无'}</span>
                <span class="language">${song.language || '无'}</span>
                <span class="note">${song.note || '无'}</span>
            `;
            songTableContent.appendChild(row);
        });
    }

    // 搜索函数
    function searchSongs() {
        const query = searchInput.value.toLowerCase();

        // 基于搜索查询筛选歌曲（匹配歌曲名或歌手名）
        const filteredSongs = songsData.filter(song => {
            return song.title.toLowerCase().includes(query) || 
                   song.artist.toLowerCase().includes(query);
        });

        // 显示筛选后的歌曲
        displaySongs(filteredSongs);
    }

    // 监听输入框和搜索按钮
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');

    // 点击搜索按钮时触发搜索
    searchButton.addEventListener('click', searchSongs);
});
