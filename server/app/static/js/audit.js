document.addEventListener('DOMContentLoaded', function() {
    const chatLinks = document.querySelectorAll('.chat-link');
    const chatBoxes = document.querySelectorAll('.chat-box');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.querySelector('.image-modal');
    const modalImg = document.getElementById('modal-img');

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
            modal.style.display = 'flex';
            modalImg.style.transform = 'translate(0px, 0px) scale(1)'; // 重置缩放和位置
            modalImg.setAttribute('data-x', 0);
            modalImg.setAttribute('data-y', 0);
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
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        scale = Math.min(Math.max(scale + delta, 0.5), 3);  // 限制缩放比例

        modalImg.style.transform = `translate(${modalImg.getAttribute('data-x')}px, ${modalImg.getAttribute('data-y')}px) scale(${scale})`;
        modalImg.scale = scale;  // 存储当前缩放比例
    });
    // 处理过审请求
    const approveButtons = document.querySelectorAll('.approve-button');
    approveButtons.forEach(approveButton => {
        approveButton.addEventListener('click', (e) => {
            e.preventDefault();
            const form = approveButton.closest('form');
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert('已提交: ' + data.message);
            })
            .catch(error => console.error('错误:', error));
        });
    });

    const rejectButtons = document.querySelectorAll('.reject-button');
    rejectButtons.forEach(rejectButton => {
        rejectButton.addEventListener('click', (e) => {
            e.preventDefault();
            const form = rejectButton.closest('form');
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert('已提交: ' + data.message);
            })
            .catch(error => console.error('错误:', error));
        });
    });
});
