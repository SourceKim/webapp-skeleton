<template>
  <view class="login-container">
    <template v-if="isRegister">
      <subpage-layout title="注册" :showHome="true">
        <view>
          <text class="login-title">注册</text>
          <view class="form-item">
            <text class="form-label">用户名</text>
            <input class="form-input" v-model="username" placeholder="请输入用户名" />
          </view>
          <view class="form-item">
            <text class="form-label">密码</text>
            <input class="form-input" v-model="password" placeholder="请输入密码" password />
          </view>
          <view class="form-item">
            <text class="form-label">邮箱（可选）</text>
            <input class="form-input" v-model="email" placeholder="请输入邮箱" />
          </view>
          <view class="form-item">
            <text class="form-label">手机号</text>
            <input class="form-input" v-model="phone" placeholder="请输入手机号" />
          </view>
          <view class="form-item">
            <text class="form-label">昵称</text>
            <input class="form-input" v-model="nickname" placeholder="请输入昵称" />
          </view>
          <view class="form-item">
            <text class="form-label">性别</text>
            <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
              <view class="form-input">{{ genderOptions[genderIndex] }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">出生日期（可选）</text>
            <input class="form-input" v-model="birthdate" placeholder="YYYY-MM-DD" />
          </view>
          <view class="form-item">
            <text class="form-label">简介（可选）</text>
            <textarea class="form-input" v-model="bio" placeholder="请输入个人简介" />
          </view>
          <button class="btn" @tap="handleSubmit" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
          <button class="link" @tap="toggleMode">已有账号？去登录</button>
        </view>
      </subpage-layout>
    </template>
    <template v-else>
      <text class="login-title">登录</text>
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input class="form-input" v-model="username" placeholder="请输入用户名" />
      </view>
      <view class="form-item">
        <text class="form-label">密码</text>
        <input class="form-input" v-model="password" placeholder="请输入密码" password />
      </view>
      <button class="btn" @tap="handleSubmit" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      <button class="link" @tap="toggleMode">没有账号？去注册</button>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Taro from '@tarojs/taro'
import { authService } from '../../services'
import SubpageLayout from '../../components/SubpageLayout/index.vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const isRegister = ref(false)
const email = ref('')
const phone = ref('')
const nickname = ref('')
const birthdate = ref('')
const bio = ref('')
const genderOptions = ['male', 'female', 'other']
const genderIndex = ref(0)
const onGenderChange = (e: any) => { genderIndex.value = Number(e.detail.value) }

onMounted(() => {
  Taro.setNavigationBarTitle({ title: isRegister.value ? '注册' : '登录' })
})

watch(isRegister, (val) => {
  Taro.setNavigationBarTitle({ title: val ? '注册' : '登录' })
})

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

const handleRegister = async () => {
  if (!username.value || !password.value || !phone.value || !nickname.value) {
    Taro.showToast({ title: '请填写用户名/密码/手机号/昵称', icon: 'none' })
    return
  }
  const gender = genderOptions[genderIndex.value]
  loading.value = true
  const resp = await authService.register({
    username: username.value,
    password: password.value,
    phone: phone.value,
    nickname: nickname.value,
    gender,
    birthdate: birthdate.value || undefined,
    email: email.value || undefined,
    bio: bio.value || undefined
  })
  loading.value = false
  if (resp.code === 0) {
    // 注册完成后直接登录
    await handleLogin()
  } else {
    Taro.showToast({ title: resp.message || '注册失败', icon: 'none' })
  }
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
}

const handleSubmit = async () => {
  if (isRegister.value) {
    await handleRegister()
  } else {
    await handleLogin()
  }
}

const handleGoBack = () => {
  const pages = Taro.getCurrentPages?.() as any[] | undefined
  if (pages && pages.length > 1) {
    Taro.navigateBack()
  } else {
    isRegister.value = false
  }
}
</script>

<style lang="scss">
.login-container { padding: 24px; }
.form-item { margin: 12px 0; }
.form-label { display: block; margin-bottom: 6px; color: #666; }
.form-input { border: 1px solid #ddd; padding: 8px; border-radius: 4px; }
.btn { margin-top: 12px; background: #1677ff; color: #fff; padding: 10px; border-radius: 4px; }
.link { margin-top: 8px; background: transparent; color: #1677ff; padding: 10px; }
.nav-back { color: #1677ff; margin-bottom: 8px; }
</style>


