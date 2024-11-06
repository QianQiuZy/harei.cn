<template>
  <v-card
    variant="text"
    prepend-avatar="https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/avatar.jpg"
    style="opacity: 0.9;background-color: rgba(255, 255, 255, 0.9);box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 1rem;"
    title="花礼harei的提问箱"
  >
    <v-card-text>
      <v-textarea
        v-model="message"
        row-height="25"
        rows="12"
        variant="outlined"
        shaped
        no-resize
      ></v-textarea>
      <v-file-input
        v-model="selectedImages"
        accept="image/png, image/jpeg, image/bmp"
        label="上传图片"
        variant="outlined"
        prepend-icon="mdi-camera"
        counter
        multiple
        show-size
        chips
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-btn block color="#4caf50" @click="save"           variant="flat"
      >
        提交
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {uploadApi} from "@/api";
import {useToast} from "vue-toast-notification";

const $toast = useToast();
const message = ref("")
const selectedImages = ref([])
const save = () => {
  if (message.value.trim() !== "" || selectedImages.value.length > 0) {
    const formData = new FormData();
    formData.append("message", message.value); // 添加文本消息
    // 添加多张图片
    selectedImages.value.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    uploadApi(formData)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        $toast.success("提交成功!", {
          position: "top",
          duration: 2000,
        });
        message.value = "";
        selectedImages.value = [];
      })
      .catch((error) => {
        console.error("Error:", error);
        $toast.error("提交失败: " + (error.error || "未知错误"),{
          position: "top",
          duration: 2000,
        });
      });
  } else {
    alert("请填写你的内容或选择至少一张图片!");
  }
}
</script>

<style scoped>

</style>
