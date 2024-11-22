function updateLiveStatus(data) {
    const liveStatusElement = document.getElementById("liveStatus");
    
    if (data.status === 1 && data.live_time) {
        const liveStartTimeUTC = parseLiveTimeToUTC(data.live_time).getTime();
        liveStatusElement.textContent = "已开播 00:00:00";

        // 每秒更新已开播时长
        setInterval(() => {
            const nowUTC = new Date().getTime();
            const diffInSeconds = Math.floor((nowUTC - liveStartTimeUTC) / 1000);

            const hours = Math.floor(diffInSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((diffInSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (diffInSeconds % 60).toString().padStart(2, '0');

            liveStatusElement.textContent = `已开播 ${hours}:${minutes}:${seconds}`;
        }, 1000);
    } else {
        liveStatusElement.textContent = "未开播";
    }
}

// 辅助函数：将直播时间字符串解析为 UTC 时间的 Date 对象
function parseLiveTimeToUTC(liveTimeString) {
    // liveTimeString 格式为 'YYYY-MM-DD HH:mm:ss'，时区为 UTC+8
    // 解析日期和时间部分
    const [datePart, timePart] = liveTimeString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);

    // 将时间转换为 UTC 时间（减去 8 小时）
    return new Date(Date.UTC(year, month - 1, day, hour - 8, minute, second));
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
setInterval(fetchLiveStatus, 60000); // 每1分钟更新一次状态
