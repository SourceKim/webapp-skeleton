<template>
  <view class="profile-container" v-if="auth.isLoggedIn">
    <view class="user-card">
      <image class="user-avatar" :src="auth.user?.avatar || 'https://picsum.photos/100/100'" />
      <view class="user-info">
        <text class="user-nickname">{{ auth.user?.nickname || auth.user?.username }}</text>
        <text class="user-username">@{{ auth.user?.username }}</text>
      </view>
    </view>
    <view class="actions">
      <button class="btn" @tap="goMyOrders">我的订单</button>
      <button class="btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

onMounted(async () => {
  const result = await auth.autoLoginByToken()
  if (!result.ok) {
    Taro.redirectTo({ url: '/pages/login/index' })
  }
})

const handleLogout = () => {
  Taro.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        auth.logout()
      }
    }
  })
}

const goMyOrders = () => {
  Taro.navigateTo({ url: '/pages/mall/order-list/index' })
}
</script>

<style lang="scss">
.profile-container { padding: 24px; }
.user-card { display: flex; align-items: center; }
.user-avatar { width: 64px; height: 64px; border-radius: 50%; margin-right: 12px; }
.btn { margin-top: 16px; background: #1677ff; color: #fff; padding: 10px; border-radius: 4px; }
</style>


