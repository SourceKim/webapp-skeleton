<template>
  <view class="profile-detail-page" v-if="auth.isLoggedIn">
    <nut-navbar title="编辑资料" left-show safe-area-inset-top @on-click-back="handleBack" />
    <view class="content">
      <view class="avatar-section">
        <image class="avatar" :src="avatarPreview || defaultAvatar" mode="aspectFill" />
        <nut-button size="small" type="info" plain @click="handleChangeAvatar">更换头像</nut-button>
      </view>

      <nut-form>
        <nut-form-item label="用户名">
          <nut-input v-model="form.username" placeholder="请输入用户名" />
        </nut-form-item>
        <nut-form-item label="新密码（可选）">
          <nut-input v-model="form.password" placeholder="请输入新密码" type="password" />
        </nut-form-item>
        <nut-form-item label="昵称">
          <nut-input v-model="form.nickname" placeholder="请输入昵称" />
        </nut-form-item>
        <nut-form-item label="邮箱">
          <nut-input v-model="form.email" placeholder="请输入邮箱" />
        </nut-form-item>
        <nut-form-item label="手机号">
          <nut-input v-model="form.phone" placeholder="请输入手机号" />
        </nut-form-item>
        <nut-form-item label="性别">
          <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
            <view class="picker-display">{{ genderOptions[genderIndex] }}</view>
          </picker>
        </nut-form-item>
        <nut-form-item label="出生日期（可选）">
          <nut-input readonly :model-value="form.birthdate" placeholder="YYYY-MM-DD" @click="openBirthPicker" />
        </nut-form-item>
        <nut-popup v-model:visible="showBirthPicker" position="bottom" round>
          <view class="popup-header">
            <text class="action" @click="showBirthPicker = false">取消</text>
            <text class="title">选择出生日期</text>
            <text class="action primary" @click="applyBirth">确定</text>
          </view>
          <nut-date-picker
            type="date"
            :min-date="minBirthDate"
            :max-date="maxBirthDate"
            @change="onBirthChange"
          />
        </nut-popup>
        <nut-form-item label="个人简介">
          <nut-textarea v-model="form.bio" placeholder="请输入简介" />
        </nut-form-item>
      </nut-form>

      <nut-button type="primary" block class="mt-16" @click="handleSubmit">保存</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useAuthStore } from '../../../stores/auth'
import { getUploadUrl, userService } from '../../../services'
import materialService from '../../../services/material'
 

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

// 出生日期选择器
const showBirthPicker = ref(false)
const tmpBirth = ref('')
const minBirthDate = new Date(1900, 0, 1)
const maxBirthDate = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const openBirthPicker = () => {
  tmpBirth.value = form.birthdate
  showBirthPicker.value = true
}
const onBirthChange = (params: { selectedOptions: Array<{ text: string; value: number }> }) => {
  try {
    const [y, m, day] = params.selectedOptions.map(o => Number(o.text))
    const d = new Date(y, m - 1, day)
    tmpBirth.value = formatDate(d)
  } catch {
    // ignore
  }
}
const applyBirth = () => {
  form.birthdate = tmpBirth.value
  showBirthPicker.value = false
}

const handleBack = () => {
  try {
    const pages = (Taro.getCurrentPages?.() || []) as any[]
    if (pages.length > 1) {
      Taro.navigateBack()
      return
    }
  } catch {}
  Taro.switchTab({ url: '/pages/profile/index' })
}

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
    avatarPreview.value = getUploadUrl(form.avatar)
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
    avatarPreview.value = getUploadUrl(path)
    Taro.showToast({ title: '头像已更新，记得保存', icon: 'none' })
  } catch (e) {
    Taro.showToast({ title: '上传失败', icon: 'none' })
  }
}
</script>

<style lang="scss">
.profile-detail-page { padding-top: 0; }
.content { padding: 16px; }
.avatar-section { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.avatar { width: 72px; height: 72px; border-radius: 50%; background: #f2f3f5; }
.picker-display { height: 40px; padding: 0 12px; border: 1px solid #eee; border-radius: 8px; background: #fafafa; display: flex; align-items: center; color: #666; }
.mt-16 { margin-top: 16px; }
.popup-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #f0f0f0; }
.popup-header .title { font-weight: 600; color: #333; }
.popup-header .action { color: #666; }
.popup-header .action.primary { color: #1677ff; }
</style>


