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

function calculateDays(targetMonth, targetDay) {
    const today = new Date();
    let year = today.getFullYear();
    
    let targetDate = new Date(year, targetMonth - 1, targetDay);
    
    // 如果目标日期已经过去，设置为下一年的同一天
    if (today > targetDate) {
        targetDate.setFullYear(year + 1);
    }
    
    // 计算两个日期之间的毫秒数
    const diffTime = targetDate - today;
    
    // 将毫秒数转换为天数，并取整
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function updateCountdown() {
    const today = new Date();
    const birthdayDays = calculateDays(3, 1); // 3月1日
    const anniversaryDays = calculateDays(7, 16); // 7月16日
    
    const birthdayElement = document.getElementById('birthdayCountdown');
    const anniversaryElement = document.getElementById('anniversaryCountdown');
    
    if (birthdayElement) {
        if (today.getMonth() === 2 && today.getDate() === 1) {
            birthdayElement.textContent = "花礼harei生日快乐！";
        } else {
            birthdayElement.textContent = `距离花礼harei生日还剩${birthdayDays}天`;
        }
    }
    
    if (anniversaryElement) {
        if (today.getMonth() === 6 && today.getDate() === 16) {
            anniversaryElement.textContent = "花礼harei出道周年快乐！";
        } else {
            anniversaryElement.textContent = `距离花礼harei出道纪念日还剩${anniversaryDays}天`;
        }
    }
}

// 在页面加载完成后更新倒计时
document.addEventListener("DOMContentLoaded", function() {
    updateCountdown();
    
    // 如果需要每天自动更新，可以设置定时器
    // 这里设置每小时更新一次
    setInterval(updateCountdown, 1000 * 60 * 60);
});

