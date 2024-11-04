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