<template>
    <v-app class="custom-bg" style="background: url('/harei-back.png') top / cover no-repeat;">
<!--  <v-app class="custom-bg">-->

    <v-navigation-drawer
      v-model="drawer"
      temporary
      color="#333"
    >
      <v-row align="center" align-content="stretch" class="pa-4">
        <v-app-bar-nav-icon class="ma-1" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-row>
      <v-list
      >
        <v-list-item
          min-height="60px"
          v-for="(item, i) in items"
          :key="i"
          :href="item.href"
          :target="item.target"
          :prepend-avatar="item.prependAvatar"
          :value="item.title"
          @click.stop="drawer = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      color="transparent"
      prominent
      :flat="true"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <v-main style="margin: 20px">
      <router-view />
    </v-main>
  </v-app>
</template>
<style>
.custom-bg {
  background-size: cover;
}
</style>
<script setup>

const drawer = ref(false);

const items = ref([
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/home.png',
    title: '首页',
    documentTitle: '花礼harei的小空间',
    href: '/',
    target: '_self',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/music.png',
    title: '歌单',
    href: '/songs',
    documentTitle: '花礼的歌单',
    target: '_self',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/box.png',
    title: '提问箱',
    documentTitle: '花礼的提问箱',
    href: '/box',
    target: '_self',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/moegirl.png',
    title: '了解花礼',
    href: 'https://mzh.moegirl.org.cn/花礼',
    target: '_blank',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/space.png',
    title: '花礼的空间',
    href: 'https://space.bilibili.com/1048135385',
    target: '_blank',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/stream.png',
    title: '花礼的直播间',
    href: 'https://live.bilibili.com/1048135385',
    target: '_blank',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/lubo.png',
    title: '花礼的录播号',
    href: 'https://space.bilibili.com/3546636416452709',
    target: '_blank',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/github.png',
    title: '加入开发',
    href: 'https://github.com/QianQiuZy/harei',
    target: '_blank',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/zuozhe.png',
    title: '联系作者',
    href: 'https://space.bilibili.com/351708822',
    target: '_blank',
  }
]);

</script>

