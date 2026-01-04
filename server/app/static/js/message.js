document.addEventListener('DOMContentLoaded', function() {
    const chatLinks = document.querySelectorAll('.chat-link');
    const chatBoxes = document.querySelectorAll('.chat-box');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.querySelector('.image-modal');
    const modalImg = document.getElementById('modal-img');
    const archiveAllButton = document.querySelector('.archive-all-button');
    const filterSelect = document.getElementById('filter-tag');
    const chatmsgElements = document.querySelectorAll('.chatmsg');

    // 处理留言文本换行及空格
    chatmsgElements.forEach(chatmsg => {
        chatmsg.innerHTML = chatmsg.innerHTML
            .replace(/^\s+/g, '')
            .replace(/\s+$/g, '');
    });

    // 设置隐藏文本样式（黑条）
    const hiddenTextElements = document.querySelectorAll('.hidden-text');
    hiddenTextElements.forEach(hiddenText => {
        hiddenText.style.backgroundColor = 'black';
        hiddenText.style.color = 'black';
        hiddenText.style.cursor = 'pointer';
        hiddenText.addEventListener('mouseenter', () => {
            hiddenText.style.color = 'white';
        });
        hiddenText.addEventListener('mouseleave', () => {
            hiddenText.style.color = 'black';
        });
    });

    // 默认显示第一条留言，并标记为已读
    if (chatBoxes.length) {
        chatBoxes[0].style.display = 'block';
        document.querySelector(`a.chat-link[data-id="${chatBoxes[0].id.replace('chat-','')}"]`).classList.add('read');
    }

    // 点击左侧聊天列表显示留言，并标记为已读
    chatLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            chatBoxes.forEach(box => box.style.display = 'none');
            const id = this.getAttribute('data-id');
            document.getElementById(`chat-${id}`).style.display = 'block';
            this.classList.add('read');
        });
    });

    // 处理留言中的链接，将以 https:// 开头的文字转换为超链接
    document.querySelectorAll('.chatmsg').forEach(msgEl => {
        msgEl.innerHTML = msgEl.innerHTML.replace(/(https:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    });

    // 加载TAG下拉选项（后端接口 /get_tags 返回 [{tag_name:"xxx"}, ...]）
    fetch("/get_tags")
        .then(response => response.json())
        .then(data => {
            data.forEach(tagObj => {
                const option = document.createElement("option");
                option.value = tagObj.tag_name;
                option.textContent = tagObj.tag_name;
                filterSelect.appendChild(option);
            });
        })
        .catch(err => console.error("获取标签失败:", err));

    // 筛选留言
    filterSelect.addEventListener('change', function() {
        const selectedTag = this.value;
        chatBoxes.forEach(box => {
            if (!selectedTag || box.getAttribute('data-tag') === selectedTag) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    });

    // 图片查看：收集当前留言中图片的 URL 以便切换
    let currentImages = [];
    let currentIndex = 0;
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            const imgUrl = thumbnail.dataset.fullImage;
            const chatBox = thumbnail.closest('.chat-box');
            currentImages = Array.from(chatBox.querySelectorAll('.thumbnail')).map(img => img.dataset.fullImage);
            currentIndex = currentImages.indexOf(imgUrl);
            showModal(imgUrl);
        });
    });

    function showModal(url) {
        modalImg.src = url;
        modal.style.display = 'flex';
    }

    // 弹窗按钮事件
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentImages.length) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            modalImg.src = currentImages[currentIndex];
        }
    });
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentImages.length) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            modalImg.src = currentImages[currentIndex];
        }
    });
    document.getElementById('close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 模态框外点击关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 拖动和缩放功能
    let isDragging = false;
    let startX, startY;
    modalImg.addEventListener('dragstart', e => e.preventDefault());
    modalImg.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX - (parseFloat(modalImg.getAttribute('data-x')) || 0);
        startY = e.clientY - (parseFloat(modalImg.getAttribute('data-y')) || 0);
        modalImg.style.cursor = 'grabbing';
        modalImg.style.transition = 'none';
    });
    window.addEventListener('mousemove', e => {
        if (isDragging) {
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            modalImg.style.transform = `translate(${x}px, ${y}px) scale(${modalImg.scale || 1})`;
            modalImg.setAttribute('data-x', x);
            modalImg.setAttribute('data-y', y);
        }
    });
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = 'grab';
            modalImg.style.transition = '';
        }
    });
    let scale = 1;
    modalImg.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.07 : -0.07;
        scale = Math.min(Math.max(scale * (1 + delta), 0.1), 10);
        modalImg.style.transform = `translate(${modalImg.getAttribute('data-x') || 0}px, ${modalImg.getAttribute('data-y') || 0}px) scale(${scale})`;
        modalImg.scale = scale;
    });

    // 一键归档按钮功能
    archiveAllButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetch('/archive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) throw new Error('网络响应不是 OK');
            return response.json();
        })
        .then(data => {
            alert('已处理: ' + data.message);
        })
        .catch(error => {
            console.error('错误:', error);
            alert('请求失败: ' + error.message);
        });
    });
});
