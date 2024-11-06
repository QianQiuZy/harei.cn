<template>
    <v-app class="custom-bg" style="background: url('/harei-back.png') top / cover no-repeat;">
<!--  <v-app class="custom-bg">-->
    <v-main style="margin: 20px" class="d-flex justify-center align-center">
      <router-view/>
    </v-main>
  </v-app>
</template>
<style>
.custom-bg {
  background-size: cover;
}
</style>

