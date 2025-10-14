<template>
  <view class="login-container">
    <text class="login-title">登录</text>
    <view class="form-item">
      <text class="form-label">用户名</text>
      <input class="form-input" v-model="username" placeholder="请输入用户名" />
    </view>
    <view class="form-item">
      <text class="form-label">密码</text>
      <input class="form-input" v-model="password" placeholder="请输入密码" password />
    </view>
    <button class="btn" @tap="handleLogin" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { authService } from '../../services'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    Taro.showToast({ title: '请输入用户名/密码', icon: 'none' })
    return
  }
  loading.value = true
  const resp = await authService.login({ username: username.value, password: password.value })
  loading.value = false
  if (resp.code === 0 && resp.data) {
    auth.setToken(resp.data.access_token)
    auth.setUser(resp.data.user)
    Taro.switchTab({ url: '/pages/general/index' })
  } else {
    Taro.showToast({ title: resp.message || '登录失败', icon: 'none' })
  }
}
</script>

<style lang="scss">
.login-container { padding: 24px; }
.form-item { margin: 12px 0; }
.form-label { display: block; margin-bottom: 6px; color: #666; }
.form-input { border: 1px solid #ddd; padding: 8px; border-radius: 4px; }
.btn { margin-top: 12px; background: #1677ff; color: #fff; padding: 10px; border-radius: 4px; }
</style>


