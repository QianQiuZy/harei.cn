document.addEventListener('DOMContentLoaded', function() {
    fetch('/music')
        .then(response => response.json())
        .then(data => {
            const songTableContent = document.getElementById('song-table-content');
            songTableContent.innerHTML = '';  // 清空旧数据
            data.forEach(song => {
                const row = document.createElement('div');
                row.classList.add('table-row');
                row.innerHTML = `
                    <span class="song-name">${song.title}</span>
                    <span class="artist-name">${song.artist}</span>
                    <span class="album-name">${song.album || '无'}</span>
                    <span class="release-date">${song.release_date || '无'}</span>
                    <span class="duration">${song.duration || '无'}</span>
                `;
                songTableContent.appendChild(row);  // 插入新的歌曲行
            });
        })
        .catch(error => console.error('Error fetching music data:', error));
});