document.addEventListener("DOMContentLoaded", () => {
    // 获取排行榜数据
    fetchRanking();

    // 上传文件表单提交处理
    const uploadForm = document.getElementById("upload-form");
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(uploadForm);

        try {
            const response = await fetch("/upload-gift-xml", {
                method: "POST",
                body: formData
            });
            const result = await response.json();

            const statusText = document.getElementById("upload-status");
            if (result.success) {
                statusText.textContent = "上传成功!";
                fetchRanking();  // 刷新排行榜
            } else {
                statusText.textContent = `上传失败: ${result.error}`;
            }
        } catch (error) {
            console.error("上传错误:", error);
            document.getElementById("upload-status").textContent = "上传过程中出错，请重试。";
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
