<template>
  <view class="profile-detail-container" v-if="auth.isLoggedIn">
    <view class="form-item">
      <text class="form-label">昵称</text>
      <input class="form-input" v-model="form.nickname" placeholder="请输入昵称" />
    </view>
    <view class="form-item">
      <text class="form-label">邮箱</text>
      <input class="form-input" v-model="form.email" placeholder="请输入邮箱" />
    </view>
    <view class="form-item">
      <text class="form-label">手机号</text>
      <input class="form-input" v-model="form.phone" placeholder="请输入手机号" />
    </view>
    <view class="form-item">
      <text class="form-label">头像URL</text>
      <input class="form-input" v-model="form.avatar" placeholder="请输入头像地址" />
    </view>
    <view class="form-item">
      <text class="form-label">个人简介</text>
      <textarea class="form-textarea" v-model="form.bio" placeholder="请输入简介" />
    </view>
    <button class="btn" @tap="handleSubmit">保存</button>
  </view>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useAuthStore } from '../../../stores/auth'
import { userService } from '../../../services'

const auth = useAuthStore()
const form = reactive({
  nickname: '',
  email: '',
  phone: '',
  avatar: '',
  bio: ''
})

onMounted(async () => {
  if (!auth.isLoggedIn) {
    await auth.autoLoginByToken()
    if (!auth.isLoggedIn) {
      Taro.redirectTo({ url: '/pages/login/index' })
      return
    }
  }
  const uid = auth.user?.id as string
  const resp = await userService.getProfile(uid)
  if (resp.code === 0 && resp.data) {
    form.nickname = resp.data.nickname || ''
    form.email = resp.data.email || ''
    form.phone = resp.data.phone || ''
    form.avatar = resp.data.avatar || ''
    form.bio = resp.data.bio || ''
  }
})

const handleSubmit = async () => {
  const uid = auth.user?.id as string
  const resp = await userService.updateProfile(uid, {
    nickname: form.nickname || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined,
    avatar: form.avatar || undefined,
    bio: form.bio || undefined
  })
  if (resp.code === 0) {
    Taro.showToast({ title: '保存成功', icon: 'success' })
    await auth.refreshProfile()
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }
}
</script>

<style lang="scss">
.profile-detail-container { padding: 16px; }
.form-item { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.form-label { font-size: 14px; color: #333; }
.form-input { height: 40px; padding: 0 12px; border: 1px solid #d9d9d9; border-radius: 4px; }
.form-textarea { min-height: 80px; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; }
.btn { margin-top: 16px; background: #1677ff; color: #fff; padding: 10px; border-radius: 4px; }
</style>


