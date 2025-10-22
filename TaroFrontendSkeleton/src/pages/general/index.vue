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

onMounted(async () => {
  const result = await auth.autoLoginByToken()
  if (!result.ok) {
    Taro.redirectTo({ url: '/pages/login/index' })
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


