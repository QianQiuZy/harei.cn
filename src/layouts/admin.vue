<template>
   <v-app class="custom-bg" style="background: url('/harei-back.png') top / cover no-repeat;">
<!--   <v-app class="custom-bg">-->
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
    <v-main style="margin: 0 20px;">
      <router-view/>

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
    href: '/admin',
    target: '_self',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/music.png',
    title: '歌单',
    href: '/admin/songManage',
    target: '_self',
  },
  {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/box.png',
    title: '留言箱',
    href: '/admin/message',
    target: '_self',
  }, {
    prependAvatar: 'https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/lubo.png',
    title: '审核界面',
    href: '/admin/audit',
    target: '_self',
  },
]);

</script>

