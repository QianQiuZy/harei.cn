document.addEventListener('DOMContentLoaded', function() {
    const chatLinks = document.querySelectorAll('.chat-link');
    const chatBoxes = document.querySelectorAll('.chat-box');
    // 显示第一个会话内容
    chatBoxes[0].style.display = 'block';

    chatLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 隐藏所有会话内容
            chatBoxes.forEach(box => {
                box.style.display = 'none';
            });

            // 获取当前点击的会话ID
            const id = this.getAttribute('data-id');
            // 显示对应的会话内容
            document.getElementById(`chat-${id}`).style.display = 'block';
        });
    });
});