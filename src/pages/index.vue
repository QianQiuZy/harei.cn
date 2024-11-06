<template>
  <v-container align="center" justify="center">
    <v-row >
      <v-col cols="12">
        <v-avatar class="transform avatar" size="180"
                  image="https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/avatar.jpg"></v-avatar>
        <h1 class="font">花礼harei</h1>
      </v-col>

      <v-col cols="12">
        <a href="https://live.bilibili.com/1820703922" target="_blank">
          <v-img class="transform" src="https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/bilibili.png"
                 width="80" height="auto"
                 contain></v-img>
        </a>
        <span class="font status-box" >{{ loading ? '正在获取直播状态...' : liveStatusText }}</span>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-col align-self="end">
        <span>
          <a href="/songs" target="_self">
            <v-img class="transform" src="https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/music.png"
                   width="80" height="auto"
                   contain></v-img></a>
          <span class="font" style="font-size: 1.2rem;">歌单</span>
        </span>

      </v-col>
      <v-col align-self="start">
        <span>
          <a href="/box" target="_self">
            <v-img class="transform" src="https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/box.png"
                   width="80" height="auto"
                   contain></v-img></a>
          <span class="font" style="font-size: 1.2rem;">提问箱</span>
        </span>
      </v-col>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-row>
    <v-row justify="center">
      <v-col>
        <p class="random-text font">{{ randomText }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
// 随机文字列表
import {useInterval, useRequest} from "vue-hooks-plus";
import {fetchLiveStatusApi} from "@/api";

const texts = [
  "礼礼不串",
  "llbc",
  "你好我是花礼harei",
  "我才不是串子呢",
  "CUTE~"
];

// 随机选择一个文字
const randomText = ref(texts[Math.floor(Math.random() * texts.length)]);
onMounted(() => {
  randomText.value = "\"" + texts[Math.floor(Math.random() * texts.length)] + "\"";
});
const  interval = ref(null);
const liveStatusText = ref('');

// 直播状态
const {data: liveStatus, loading, error} = useRequest(fetchLiveStatusApi, {
  pollingInterval: 60000,
  onSuccess: (res) => {
    if (res.status === 1 && res.live_time) {
      if (interval.value) {
        return;
      }
      interval.value = useInterval(() => {
        const liveStartTime = new Date(liveStatus.value.live_time);
        const now = new Date();
        const diffInSeconds = Math.floor((now - liveStartTime) / 1000);

        const hours = Math.floor(diffInSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diffInSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (diffInSeconds % 60).toString().padStart(2, '0');
        liveStatusText.value = `已开播 ${hours}:${minutes}:${seconds}`;
      }, 1000);
      liveStatusText.value = `已开播 00:00:00`;
    } else {
      liveStatusText.value = "未开播";
    }
  },
  onError: () => {
    liveStatusText.value = "获取直播状态失败，请稍后再试";
  }
});


</script>
<style scoped lang="scss">
h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
}
.font {
  font-family: 'Child Fun Sans Demo', serif;
}
.avatar {
  border: 4px solid white;

}

.transform {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
}

.random-text {
  text-align: center;
  font-size: 3rem;
  color: #666;
}
.status-box {
  font-size: 12px;
  margin-top: 10px;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: white;
  color: #333;
  font-weight: bold;
  margin-left: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

</style>


