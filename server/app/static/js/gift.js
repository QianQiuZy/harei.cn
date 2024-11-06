document.addEventListener("DOMContentLoaded", () => {
    // 获取排行榜数据
    fetchRanking();

    // 表单提交处理，查询特定用户的礼物数量
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const userUID = document.getElementById("user-uid").value.trim();

        if (userUID) {
            try {
                const response = await fetch(`/gift-count/${userUID}`);
                const data = await response.json();

                // 计算用户称号
                const rankTitle = calculateRankTitle(data.gift_count);

                // 显示用户礼物数量和称号
                const resultText = data.gift_count !== undefined
                    ? `用户名: ${data.username} (UID: ${userUID}), 礼物数量: ${data.gift_count}, 称号: ${rankTitle}`
                    : `未找到该用户的礼物记录`;
                document.getElementById("user-gift-count").textContent = resultText;

            } catch (error) {
                console.error("查询用户礼物数量出错:", error);
                document.getElementById("user-gift-count").textContent = "查询出错，请重试。";
            }
        } else {
            document.getElementById("user-gift-count").textContent = "请输入有效的用户UID。";
        }
    });
});

// 根据礼物数量计算称号
function calculateRankTitle(giftCount) {
    if (giftCount >= 1 && giftCount <= 9) {
        return `豆之气${giftCount}段`;
    } else if (giftCount >= 10 && giftCount <= 99) {
        return `豆者${Math.floor(giftCount / 10)}星`;
    } else if (giftCount >= 100 && giftCount <= 999) {
        return `豆师${Math.floor(giftCount / 100)}星`;
    } else if (giftCount >= 1000 && giftCount <= 9999) {
        return `大豆师${Math.floor(giftCount / 1000)}星`;
    } else if (giftCount >= 10000 && giftCount <= 99999) {
        return `豆灵${Math.floor(giftCount / 10000)}星`;
    } else if (giftCount >= 100000 && giftCount <= 999999) {
        return `豆王${Math.floor(giftCount / 100000)}星`;
    } else if (giftCount >= 1000000 && giftCount <= 9999999) {
        return `豆皇${Math.floor(giftCount / 1000000)}星`;
    } else if (giftCount >= 10000000 && giftCount <= 99999999) {
        return `豆宗${Math.floor(giftCount / 10000000)}星`;
    } else {
        return "无称号";
    }
}

// 获取排行榜数据并更新表格
async function fetchRanking() {
    try {
        const response = await fetch("/gift-ranking");
        const rankingData = await response.json();

        const rankingTableBody = document.getElementById("ranking-table").querySelector("tbody");
        rankingTableBody.innerHTML = "";  // 清空现有表格内容

        rankingData.forEach((item, index) => {
            const rankTitle = calculateRankTitle(item.gift_count);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${rankTitle}</td>
                <td>${item.username}</td>
                <td>${item.user_uid}</td>
                <td>${item.gift_count}</td>
            `;
            rankingTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("获取排行榜数据出错:", error);
        const rankingTableBody = document.getElementById("ranking-table").querySelector("tbody");
        rankingTableBody.innerHTML = "<tr><td colspan='5'>无法加载排行榜数据。</td></tr>";
    }
}
