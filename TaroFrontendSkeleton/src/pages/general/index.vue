<template>
  <view class="general-home">
    <nut-navbar title="首页" safe-area-inset-top />

    <view class="welcome card">
      <text class="hello">Hello{{ username }}</text>
      <nut-row type="flex" justify="space-between" class="mt-10">
        <nut-col :span="11">
          <nut-button type="primary" block @tap="goMall">进入商城</nut-button>
        </nut-col>
        <nut-col :span="11">
          <nut-button type="info" block @tap="goProfile">个人中心</nut-button>
        </nut-col>
      </nut-row>
    </view>
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

const goMall = () => Taro.switchTab({ url: '/pages/mall/index' })
const goProfile = () => Taro.switchTab({ url: '/pages/profile/index' })
const goResource = () => Taro.switchTab({ url: '/pages/resource/index' })
const goOrderList = () => Taro.navigateTo({ url: '/pages/mall/order-list/index' })
</script>

<style lang="scss">
.general-home {
  padding: 24px;
  .hello {
    font-size: 20px;
  }
}
.welcome { margin-bottom: 12px; }
</style>


