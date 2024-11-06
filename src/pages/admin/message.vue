<template>
  <v-container class="profile-section" style="max-width: 100%; width: 100%">
    <v-row>
      <v-toolbar density="compact" color="rgba(255, 255, 255, 0.9)">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="archiveAllMessages()"
        >一键归档已审核消息
        </v-btn
        >
        <v-btn
          color="primary"
          @click="selectMessage(currentMessageIndex - 1)"
          :disabled="currentMessageIndex === 0"
        >
          上一条
        </v-btn>
        <v-btn
          color="primary"
          @click="selectMessage(currentMessageIndex + 1)"
          :disabled="currentMessageIndex === messages.length - 1"
        >
          下一条
        </v-btn>
      </v-toolbar>
    </v-row>
    <v-row>
      <v-col cols="6">

        <v-virtual-scroll :items="messages">
          <template v-slot:default="{ item, index }">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-list-item
                  :key="item.id"
                  flat
                  link
                  v-bind="props"
                  :class="[
                    'pa-6',
                    index === currentMessageIndex ? 'bg-grey-lighten-2' : '',
                  ]"
                  @click="selectMessage(index)"
                  :title="item.content"
                >
                </v-list-item>
              </template>
            </v-hover>
          </template>
        </v-virtual-scroll>


      </v-col>
      <v-col>
        <div class="chat-container position-relative pa-6">
          <v-card variant="text" class="chat-box">
            <v-card-text>
              {{ currentMessage.content }}
              <v-row
                v-if="currentMessage.images && currentMessage.images.length > 0"
                style="margin-top: 5px"
              >
                <v-col
                  v-for="(image, i) in currentMessage.images"
                  :key="i"
                  class="d-flex child-flex"
                  cols="3"
                  @click="handleShow(image)"
                >
                  <v-img
                    :lazy-src="image"
                    :src="image"
                    aspect-ratio="1"
                    class="bg-grey-lighten-2"
                    cover
                    style="cursor: pointer"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        align="center"
                        class="fill-height ma-0"
                        justify="center"
                      >
                        <v-progress-circular
                          color="grey-lighten-5"
                          indeterminate
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
              </v-row>

            </v-card-text>
          </v-card>
          <custom-photo-slider
            v-if="currentMessage.images && currentMessage.images.length > 0"
            style="position: absolute"
            :items="items"
            :visible="visible"
            :index="currentImageIndex"
            @changeIndex="changeIndex"
            @clickMask="handleHide"
            @closeModal="handleHide"
          />
        </div>

      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>
.profile-section {
  background-color: rgba(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  box-sizing: border-box;
}

.view-box {
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  object-fit: cover;
}
.chat-container{
  height: 76vh;
  background-color: #f7f7f7;
}
.chat-box {
  max-height: 70vh;
  background-color: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: auto;
}
</style>
<script setup>
import {archiveAllMessagesApi, fetchMessagesApi} from "@/api";
import {CustomPhotoSlider} from "vue3-photo-preview";
import {useRequest} from "vue-hooks-plus";
import {useToast} from "vue-toast-notification";

const tabs = ref("approved");

const visible = ref(false);
const currentMessageIndex = ref(0);
const currentImageIndex = ref(0);
const messages = computed(() => {
  if (!allMessages.value || allMessages.value.length === 0) {
    return [];
  }
  return allMessages.value.filter((message) => message.status === tabs.value);
});

const currentMessage = computed(() => {
  if (messages.value.length === 0) {
    return {
      id: 0,
      title: "",
      content: "",
      status: "",
      images: [],
    };
  }
  return messages.value[currentMessageIndex.value];
});

const items = computed(() => {
  return currentMessage.value.images
    ? currentMessage.value.images.map((src) => ({
      src,
      key: src,
    }))
    : [];
});

const {data: allMessages, loading} = useRequest(
  fetchMessagesApi, {
    onError: error => {
      console.error("错误:", error);
    }
  });


const selectMessage = (index) => {
  currentMessageIndex.value = index;
};

const archiveAllMessages = () => {
  archiveAllMessagesApi()
    .then((response) => {
      alert("已处理: " + response.message); // 显示已处理提示
      // 这里可以添加逻辑更新页面内容或其他操作
    })
    .catch((error) => {
      console.error("错误:", error);
      alert("请求失败: " + error.data.message); // 显示错误提示
    });
};

const changeIndex = (index) => {
  currentImageIndex.value = index;
};

const handleShow = (key) => {
  const itemIndex = items.value.findIndex((item) => item.key === key);

  if (itemIndex > -1) {
    currentImageIndex.value = itemIndex;
    visible.value = true;
  }
};

const handleHide = () => {
  visible.value = false;
};
</script>
