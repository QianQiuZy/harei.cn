document.addEventListener('DOMContentLoaded', function() {
    const chatLinks = document.querySelectorAll('.chat-link');
    const chatBoxes = document.querySelectorAll('.chat-box');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.querySelector('.image-modal');
    const modalImg = document.getElementById('modal-img');
    const archiveAllButton = document.querySelector('.archive-all-button');

    // 显示聊天框
    chatBoxes[0].style.display = 'block';

    chatLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            chatBoxes.forEach(box => {
                box.style.display = 'none';
            });
            const id = this.getAttribute('data-id');
            document.getElementById(`chat-${id}`).style.display = 'block';
        });
    });

    // 点击缩略图时显示大图
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            modalImg.src = thumbnail.dataset.fullImage;

            // 初始显示时将图片根据展示区域大小进行适当缩放
            modal.style.display = 'flex';
            modalImg.onload = () => {
                const imgWidth = modalImg.naturalWidth;
                const imgHeight = modalImg.naturalHeight;
                const containerWidth = window.innerWidth / 2; // 右侧内容区域的宽度
                const containerHeight = window.innerHeight;    // 右侧内容区域的高度

                // 计算初始缩放比例，使图片不超过右侧显示区域的大小
                let initialScale = Math.min(containerWidth / imgWidth, containerHeight / imgHeight, 1);
                modalImg.style.transform = `translate(0px, 0px) scale(${initialScale})`; 
                modalImg.setAttribute('data-x', 0);
                modalImg.setAttribute('data-y', 0);
                modalImg.scale = initialScale;  // 存储初始缩放比例
            };
        });
    });

    // 点击模态框外部区域关闭大图
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {  // 只在点击模态框背景时关闭
            modal.style.display = 'none';
        }
    });

    // 初始化拖动和缩放功能
    let isDragging = false;
    let startX, startY;

    // 阻止图片被默认行为选中
    modalImg.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // 拖动开始
    modalImg.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - (parseFloat(modalImg.getAttribute('data-x')) || 0);
        startY = e.clientY - (parseFloat(modalImg.getAttribute('data-y')) || 0);
        modalImg.style.cursor = 'grabbing';  // 改变鼠标样式为抓取
        modalImg.style.transition = 'none';  // 禁用过渡效果
    });

    // 拖动中
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - startX;
            const y = e.clientY - startY;

            modalImg.style.transform = `translate(${x}px, ${y}px) scale(${modalImg.scale || 1})`;
            modalImg.setAttribute('data-x', x);
            modalImg.setAttribute('data-y', y);
        }
    });

    // 拖动结束
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = 'grab';  // 改变鼠标样式回到默认
            modalImg.style.transition = '';  // 恢复过渡效果
        }
    });

    // 缩放功能
    let scale = 1;
    modalImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.07 : -0.07;
        scale = Math.min(Math.max(scale * (1 + delta), 0.1), 10);

        modalImg.style.transform = `translate(${modalImg.getAttribute('data-x')}px, ${modalImg.getAttribute('data-y')}px) scale(${scale})`;
        modalImg.scale = scale;  // 存储当前缩放比例
    });

    // 一键归档已审核消息按钮功能
    archiveAllButton.addEventListener('click', (e) => {
        e.preventDefault(); // 阻止默认提交行为

        // 发送POST请求进行归档所有消息
        fetch('/archive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // 设置内容类型为 JSON
            },
            body: JSON.stringify({}) // 发送空 JSON 对象
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不是 OK');
            }
            return response.json();
        })
        .then(data => {
            alert('已处理: ' + data.message); // 显示已处理提示
            // 这里可以添加逻辑更新页面内容或其他操作
        })
        .catch(error => {
            console.error('错误:', error);
            alert('请求失败: ' + error.message); // 显示错误提示
        });
    });
    
});
