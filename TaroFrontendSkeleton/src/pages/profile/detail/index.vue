<template>
  <SubpageLayout title="编辑资料" :showHome="true">
  <view class="profile-detail-container" v-if="auth.isLoggedIn">
    <view class="avatar-section">
      <image class="avatar" :src="avatarPreview || defaultAvatar" mode="aspectFill" />
      <button class="btn-secondary" @tap="handleChangeAvatar">更换头像</button>
    </view>

    <view class="form-item">
      <text class="form-label">用户名</text>
      <input class="form-input" v-model="form.username" placeholder="请输入用户名" />
    </view>
    <view class="form-item">
      <text class="form-label">新密码（可选）</text>
      <input class="form-input" v-model="form.password" placeholder="请输入新密码" password />
    </view>
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
      <text class="form-label">性别</text>
      <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
        <view class="form-input">{{ genderOptions[genderIndex] }}</view>
      </picker>
    </view>
    <view class="form-item">
      <text class="form-label">出生日期（可选）</text>
      <input class="form-input" v-model="form.birthdate" placeholder="YYYY-MM-DD" />
    </view>
    <view class="form-item">
      <text class="form-label">个人简介</text>
      <textarea class="form-textarea" v-model="form.bio" placeholder="请输入简介" />
    </view>
    <button class="btn" @tap="handleSubmit">保存</button>
  </view>
  </SubpageLayout>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useAuthStore } from '../../../stores/auth'
import { userService } from '../../../services'
import materialService from '../../../services/material'
import SubpageLayout from '../../../components/SubpageLayout/index.vue'

const auth = useAuthStore()
const form = reactive({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  avatar: '',
  bio: '',
  gender: 'male' as 'male'|'female'|'other',
  birthdate: ''
})
const genderOptions = ['male','female','other']
const genderIndex = ref(0)
const onGenderChange = (e: any) => { genderIndex.value = Number(e.detail.value); form.gender = genderOptions[genderIndex.value] as any }

const defaultAvatar = 'https://picsum.photos/100/100'
const avatarPreview = ref('')
const FILE_BASE = 'http://localhost:3000/uploads/'

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
    form.username = (resp.data as any).username || ''
    form.nickname = resp.data.nickname || ''
    form.email = resp.data.email || ''
    form.phone = resp.data.phone || ''
    form.avatar = resp.data.avatar || ''
    form.bio = resp.data.bio || ''
    form.gender = ((resp.data as any).gender || 'male') as any
    form.birthdate = ((resp.data as any).birthdate || '') as any
    genderIndex.value = Math.max(0, genderOptions.indexOf(form.gender))
    avatarPreview.value = form.avatar ? (form.avatar.startsWith('http') ? form.avatar : (FILE_BASE + form.avatar)) : ''
  }
})

const handleSubmit = async () => {
  const uid = auth.user?.id as string
  const resp = await userService.updateProfile(uid, {
    username: form.username || undefined,
    password: form.password || undefined,
    nickname: form.nickname || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined,
    avatar: form.avatar || undefined,
    bio: form.bio || undefined,
    gender: form.gender || undefined,
    birthdate: form.birthdate || undefined
  })
  if (resp.code === 0) {
    Taro.showToast({ title: '保存成功', icon: 'success' })
    await auth.refreshProfile()
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }
}

const handleChangeAvatar = async () => {
  try {
    const choose = await Taro.chooseImage({ count: 1 })
    const filePath = choose.tempFilePaths[0]
    const uploaded = await materialService.uploadMaterialAsUser(filePath, { is_public: true })
    // 以相对路径存库，前端展示拼接 BASE
    const path = (uploaded as any).file_path || (uploaded as any).path || ''
    form.avatar = path
    avatarPreview.value = path ? (path.startsWith('http') ? path : (FILE_BASE + path)) : ''
    Taro.showToast({ title: '头像已更新，记得保存', icon: 'none' })
  } catch (e) {
    Taro.showToast({ title: '上传失败', icon: 'none' })
  }
}
</script>

<style lang="scss">
.profile-detail-container { padding: 16px; }
.avatar-section { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.avatar { width: 72px; height: 72px; border-radius: 50%; background: #f2f3f5; }
.form-item { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.form-label { font-size: 14px; color: #333; }
.form-input { height: 40px; padding: 0 12px; border: 1px solid #d9d9d9; border-radius: 4px; }
.form-textarea { min-height: 80px; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; }
.btn { margin-top: 16px; background: #1677ff; color: #fff; padding: 10px; border-radius: 4px; }
.btn-secondary { background: #f0f0f0; color: #333; padding: 8px 12px; border-radius: 4px; }
</style>


