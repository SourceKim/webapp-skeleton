<template>
  <view class="general-home">
    <text class="hello">Hello{{ username }}</text>
  </view>
  
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.loadFromStorage()
  if (!auth.isLoggedIn) {
    Taro.redirectTo({ url: '/pages/login/index' })
  } else if (!auth.user) {
    auth.refreshProfile()
  }
})

const username = computed(() => auth.user?.username ? `, ${auth.user.username}` : '')
</script>

<style lang="scss">
.general-home {
  padding: 24px;
  .hello {
    font-size: 20px;
  }
}
</style>


