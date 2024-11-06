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

                // 显示用户礼物数量
                const resultText = data.gift_count !== undefined
                    ? `用户名: ${data.username} (UID: ${userUID}), 礼物数量: ${data.gift_count}`
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

// 获取排行榜数据并更新表格
async function fetchRanking() {
    try {
        const response = await fetch("/gift-ranking");
        const rankingData = await response.json();

        const rankingTableBody = document.getElementById("ranking-table").querySelector("tbody");
        rankingTableBody.innerHTML = "";  // 清空现有表格内容

        rankingData.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.username}</td>
                <td>${item.user_uid}</td>
                <td>${item.gift_count}</td>
            `;
            rankingTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("获取排行榜数据出错:", error);
        const rankingTableBody = document.getElementById("ranking-table").querySelector("tbody");
        rankingTableBody.innerHTML = "<tr><td colspan='4'>无法加载排行榜数据。</td></tr>";
    }
}
