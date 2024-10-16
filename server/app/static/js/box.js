const imageInput = document.getElementById("image-input");
const addFilesButton = document.getElementById("add-files-button");
const thumbnailContainer = document.getElementById("thumbnail-container");
let selectedImages = [];

// 点击"添加文件"按钮时触发文件选择
addFilesButton.addEventListener("click", function () {
  imageInput.click();
});

// 监听图片选择事件
imageInput.addEventListener("change", function (event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    selectedImages.push(file);

    // 创建 FileReader 对象，读取图片并显示缩略图
    const reader = new FileReader();
    reader.onload = function (e) {
      // 创建缩略图元素
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("thumbnail");

      const img = document.createElement("img");
      img.src = e.target.result;

      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "×";

      // 点击 "×" 按钮时移除图片
      removeBtn.addEventListener("click", function () {
        thumbnail.remove(); // 从DOM中移除缩略图
        selectedImages = selectedImages.filter((f) => f !== file); // 从selectedImages中移除
      });

      thumbnail.appendChild(img);
      thumbnail.appendChild(removeBtn);
      thumbnailContainer.appendChild(thumbnail);
    };

    reader.readAsDataURL(file); // 读取图片文件
  }
});

document
  .getElementById("submit-button")
  .addEventListener("click", function () {
    const message = document.getElementById("message-input").value;

    if (message.trim() !== "" || selectedImages.length > 0) {
      const formData = new FormData();
      formData.append("message", message); // 添加文本消息
      // 添加多张图片
      selectedImages.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            document.getElementById("success-message").style.display =
              "block";
            document.getElementById("message-input").value = "";
            thumbnailContainer.innerHTML = ""; // 清空缩略图
            imageInput.value = ""; // 重置文件输入框
            selectedImages = []; // 清空已选图片
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("请填写你的内容或选择至少一张图片!");
    }
  });