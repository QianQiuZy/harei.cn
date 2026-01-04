const imageInput = document.getElementById("image-input");
const addFilesButton = document.getElementById("add-files-button");
const thumbnailContainer = document.getElementById("thumbnail-container");
const tagSelect = document.getElementById("tag-select");
const uploadProgressContainer = document.getElementById("upload-progress-container");
const uploadProgress = document.getElementById("upload-progress");
let selectedImages = [];

// 获取后端TAG数据，假设接口为 /get_tags 返回 JSON 数组 [{tag_name:"xxx"},...]
function loadTags() {
  fetch("/get_tags")
    .then(response => response.json())
    .then(data => {
      data.forEach(tagObj => {
        const option = document.createElement("option");
        option.value = tagObj.tag_name;
        option.textContent = tagObj.tag_name;
        tagSelect.appendChild(option);
      });
    })
    .catch(err => console.error("获取标签失败:", err));
}
loadTags();

// 添加图片按钮点击
addFilesButton.addEventListener("click", function () {
  imageInput.click();
});

// 监听图片选择事件，显示缩略图
imageInput.addEventListener("change", function (event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    selectedImages.push(file);
    const reader = new FileReader();
    reader.onload = function (e) {
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("thumbnail");
      const img = document.createElement("img");
      img.src = e.target.result;
      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", function () {
        thumbnail.remove();
        selectedImages = selectedImages.filter(f => f !== file);
      });
      thumbnail.appendChild(img);
      thumbnail.appendChild(removeBtn);
      thumbnailContainer.appendChild(thumbnail);
    };
    reader.readAsDataURL(file);
  }
});

// 使用 XMLHttpRequest 实现上传进度
document.getElementById("submit-button").addEventListener("click", function () {
  const message = document.getElementById("message-input").value;
  const tag = tagSelect.value;

  // 如果未选择TAG，则阻止提交
  if (!tag) {
    alert("请选择一个TAG！");
    return;
  }

  if (message.trim() !== "" || selectedImages.length > 0) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("tag", tag);
    selectedImages.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    // 显示进度条
    uploadProgressContainer.style.display = "block";

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        uploadProgress.value = percentComplete;
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          const modal = document.getElementById("success-modal");
          modal.style.display = "block";
          document.getElementById("message-input").value = "";
          thumbnailContainer.innerHTML = "";
          imageInput.value = "";
          selectedImages = [];
          setTimeout(() => {
            modal.style.display = "none";
            window.location.reload();
          }, 2000);
        }
      } else {
        alert("提交失败: " + xhr.statusText);
      }
      uploadProgressContainer.style.display = "none";
    };

    xhr.onerror = function () {
      alert("上传过程中发生错误");
      uploadProgressContainer.style.display = "none";
    };

    xhr.send(formData);
  } else {
    alert("请填写内容或选择至少一张图片!");
  }
});
