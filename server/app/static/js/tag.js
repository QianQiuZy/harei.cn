document.addEventListener('DOMContentLoaded', function() {
    const addTagBtn = document.getElementById('add-tag-btn');
    const newTagInput = document.getElementById('new-tag');
    const tagList = document.getElementById('tag-list');
  
    // 增加TAG
    addTagBtn.addEventListener('click', function() {
      const tag = newTagInput.value.trim();
      if (!tag) {
        alert('请输入TAG名称');
        return;
      }
      // 提交新增TAG请求
      fetch('/tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=add&tag=${encodeURIComponent(tag)}`
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 简单刷新页面
          window.location.reload();
        } else {
          alert('新增TAG失败');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('请求出错');
      });
    });
  
    // 删除TAG
    document.querySelectorAll('.delete-tag-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const tag = this.getAttribute('data-tag');
        if (confirm(`确定删除 TAG ${tag} 吗？`)) {
          fetch('/tag', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=delete&tag=${encodeURIComponent(tag)}`
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              window.location.reload();
            } else {
              alert('删除TAG失败');
            }
          })
          .catch(err => {
            console.error('Error:', err);
            alert('请求出错');
          });
        }
      });
    });
  });
  