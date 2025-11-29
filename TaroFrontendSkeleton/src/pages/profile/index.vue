<template>
  <view class="profile-container" v-if="auth.isLoggedIn">
    <nut-navbar title="我的" safe-area-inset-top />

    <nut-cell-group>
      <nut-cell>
        <template #title>
          <view class="user-card">
            <image 
              v-if="auth.user?.avatar" 
              class="user-avatar" 
              :src="getUploadUrl(auth.user?.avatar)" 
              mode="aspectFill"
            />
            <nut-avatar 
              v-else 
              size="large" 
              color="white" 
              bg-color="blue" 
              class="user-avatar-def"
            >
              {{ (auth.user?.nickname || auth.user?.username || 'U').charAt(0) }}
            </nut-avatar>
            <view class="user-info">
              <text class="user-nickname">{{ auth.user?.nickname || auth.user?.username }}</text>
              <text class="user-username">@{{ auth.user?.username }}</text>
            </view>
          </view>
        </template>
      </nut-cell>
    </nut-cell-group>

    <view class="stats-row">
      <view class="stat-item">
        <text class="num">{{ stats.couponCount }}</text>
        <text class="label">优惠券</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.pointCount }}</text>
        <text class="label">积分</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.totalConsumption }}</text>
        <text class="label">历史消费</text>
      </view>
    </view>

    <nut-cell-group title="账户">
      <nut-cell title="我的订单" is-link @click="goMyOrders" />
      <nut-cell title="地址管理" is-link @click="goAddresses" />
      <nut-cell title="编辑资料" is-link @click="goEditProfile" />
    </nut-cell-group>

    <view class="mt-10">
      <nut-button type="danger" block @click="handleLogout">退出登录</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAuthStore } from '../../stores/auth'
import { getUploadUrl } from '../../services'
import userService from '@/services/user'

const auth = useAuthStore()
const stats = ref({ couponCount: 0, pointCount: 0, totalConsumption: '0.00' })

async function loadStats() {
  const res = await userService.getStats()
  if (res.code === 0 && res.data) {
    stats.value = res.data
  }
}

onMounted(async () => {
  const result = await auth.autoLoginByToken()
  if (!result.ok) {
    Taro.redirectTo({ url: '/pages/login/index' })
  }
  loadStats()
})

useDidShow(() => {
  if (auth.isLoggedIn) loadStats()
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

const goEditProfile = () => {
  Taro.navigateTo({ url: '/pages/profile/detail/index' })
}

const goAddresses = () => {
  Taro.navigateTo({ url: '/pages/address/index' })
}
</script>

<style lang="scss">
.profile-container { padding: 24px; }
.user-card { display: flex; align-items: center; }
.user-avatar { width: 64px; height: 64px; border-radius: 50%; margin-right: 12px; }
.user-avatar-def { margin-right: 12px; }
.btn { margin-top: 16px; background: #1677ff; color: #fff; padding: 10px; border-radius: 4px; }

.stats-row {
  display: flex;
  background: #fff;
  padding: 16px 0;
  margin-top: 12px;
  border-radius: 8px;
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stat-item .num {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.stat-item .label {
  font-size: 12px;
  color: #666;
}
</style>


