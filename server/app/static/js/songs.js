document.addEventListener('DOMContentLoaded', function() {
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
            populateDropdowns(songsData); // 根据数据填充下拉菜单
            displaySongs(songsData); // 页面加载时显示所有歌曲
        })
        .catch(error => console.error('获取歌曲数据出错:', error));

    // 动态生成下拉菜单的选项
    function populateDropdowns(songs) {
        const genreSet = new Set();
        const languageSet = new Set();

        // 提取每首歌的风格和语言，并存入集合
        songs.forEach(song => {
            if (song.type) genreSet.add(song.type);
            if (song.language) languageSet.add(song.language);
        });

        // 获取下拉菜单元素
        const genreSelect = document.getElementById('genre-select');
        const languageSelect = document.getElementById('language-select');

        // 填充风格下拉菜单
        genreSet.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });

        // 填充语言下拉菜单
        languageSet.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageSelect.appendChild(option);
        });
    }

    // 显示歌曲的函数
    function displaySongs(songsToDisplay) {
        const songTableContent = document.getElementById('song-table-content');
        songTableContent.innerHTML = '';  // 清空旧数据

        // 循环遍历每首歌曲并创建相应的行
        songsToDisplay.forEach(song => {
            const row = document.createElement('div');
            row.classList.add('table-row');
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

    // 搜索和过滤函数
    function searchSongs() {
        const query = searchInput.value.toLowerCase();
        const selectedGenre = genreSelect.value;
        const selectedLanguage = languageSelect.value;

        // 基于搜索查询、风格和语言筛选歌曲
        const filteredSongs = songsData.filter(song => {
            const matchesTitleOrArtist = song.title.toLowerCase().includes(query) || 
                                         song.artist.toLowerCase().includes(query);
            const matchesGenre = selectedGenre === '' || song.type === selectedGenre;
            const matchesLanguage = selectedLanguage === '' || song.language === selectedLanguage;

            return matchesTitleOrArtist && matchesGenre && matchesLanguage;
        });

        // 显示筛选后的歌曲
        displaySongs(filteredSongs);
    }

    // 监听输入框和下拉菜单的变化
    const searchInput = document.getElementById('search');
    const genreSelect = document.getElementById('genre-select');
    const languageSelect = document.getElementById('language-select');

    // 当用户在搜索框中输入时，自动触发搜索
    searchInput.addEventListener('input', searchSongs);

    // 当用户选择风格或语言时，自动触发搜索
    genreSelect.addEventListener('change', searchSongs);
    languageSelect.addEventListener('change', searchSongs);
});
