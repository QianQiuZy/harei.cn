<template>
  <v-container justify="center">
    <v-form ref="form" v-model="valid" @submit.prevent="submit" fast-fail>
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >

        <div class="text-subtitle-1 text-medium-emphasis">账号</div>

        <v-text-field
          v-model="state.username"
          density="compact"
          prepend-inner-icon="mdi-email-outline"
          :rules="rules"
          variant="outlined"
        ></v-text-field>

        <div style="margin-top: 1rem"
             class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          密码
        </div>

        <v-text-field
          v-model="state.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          :rules="rules"
          density="compact"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
        <div style="color:#dc3545"
             class="text-caption"
        >{{ error.message }}
        </div>
        <v-btn
          class="mb-8"
          style="margin-top: 1rem"
          color="blue"
          size="large"
          variant="tonal"
          block
          type="submit"
        >
          登录
        </v-btn>

      </v-card>

    </v-form>

  </v-container>
</template>
<script setup>
import {login} from "@/api";
import router from "@/router";

const visible = ref(false)
const valid = ref(false)

const initialState = {
  username: '',
  password: '',
}
const state = reactive({
  ...initialState,
})
const rules = [
  value => {
    if (value) return true

    return '为必填项'
  },
]
const error = ref({message: ''})
const submit = () => {
  if (valid.value) {
    login(state).then(res => {
      console.log(res)
      if (res.code === 200) {
        console.log(res.token)
        router.push('/admin')
      } else {
        console.log('failed')
        error.value = {message: '用户名或密码错误'}
      }
    }).catch(err => {
      console.log(err)
      error.value = {message: '用户名或密码错误'}
    })
  } else {
    console.log('invalid')
  }
}
watch(() => state, (val) => {
  error.value.message = ''
}, {deep: true})
</script>
