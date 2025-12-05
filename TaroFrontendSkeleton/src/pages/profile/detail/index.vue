<template>
  <view class="profile-detail-page" v-if="auth.isLoggedIn">
    <nut-navbar title="编辑资料" left-show safe-area-inset-top @on-click-back="handleBack" />
    <view class="content">
      <view class="avatar-section" @click="handleChangeAvatar">
        <nut-avatar size="large" shape="round">
          <img :src="avatarPreview" v-if="avatarPreview" />
          <text v-else>{{ (form.nickname || form.username || 'U').charAt(0).toUpperCase() }}</text>
        </nut-avatar>
        <view class="avatar-label">点击更换头像</view>
      </view>

      <nut-form>
        <nut-form-item label="用户名">
          <view class="readonly-text">{{ form.username }}</view>
        </nut-form-item>
        <nut-form-item label="昵称">
          <nut-input v-model="form.nickname" placeholder="请输入昵称" />
        </nut-form-item>
        <nut-form-item label="邮箱">
          <nut-input v-model="form.email" placeholder="请输入邮箱" />
        </nut-form-item>
        
        <nut-form-item label="性别">
          <picker mode="selector" :range="genderOptionsCN" :value="genderIndex" @change="onGenderChange">
            <view class="picker-display">
              <text>{{ genderOptionsCN[genderIndex] }}</text>
              <nut-icon name="right" size="12" color="#999" />
            </view>
          </picker>
        </nut-form-item>

        <nut-form-item label="出生日期">
          <view class="picker-display" @click="openBirthPicker">
             <text :class="{ placeholder: !form.birthdate }">{{ form.birthdate || '请选择出生年月日' }}</text>
             <nut-icon name="right" size="12" color="#999" />
          </view>
        </nut-form-item>

        <nut-popup v-model:visible="showBirthPicker" position="bottom" round>
          <nut-date-picker
            v-model="currentDate"
            type="date"
            title="选择出生日期"
            :min-date="minBirthDate"
            :max-date="maxBirthDate"
            :is-show-chinese="true"
            @confirm="applyBirth"
            @cancel="showBirthPicker = false"
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
  nickname: '',
  email: '',
  avatar: '',
  bio: '',
  gender: 'male' as 'male'|'female'|'other',
  birthdate: ''
})

// 性别选择
const genderOptionsCN = ['男', '女', '保密']
const genderValues = ['male', 'female', 'other']
const genderIndex = ref(0)
const onGenderChange = (e: any) => { 
  const idx = Number(e.detail.value)
  genderIndex.value = idx
  form.gender = genderValues[idx] as any
}

const avatarPreview = ref('')

// 出生日期选择器
const showBirthPicker = ref(false)
const currentDate = ref(new Date())
const minBirthDate = new Date(1900, 0, 1)
const maxBirthDate = new Date()

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const openBirthPicker = () => {
  if (form.birthdate) {
    currentDate.value = new Date(form.birthdate)
  }
  showBirthPicker.value = true
}

const applyBirth = ({ selectedValue, selectedOptions }: any) => {
  // NutUI DatePicker confirm 事件返回 { selectedValue, selectedOptions }
  // selectedOptions 是数组 [{ text: '2023', value: '2023' }, ...]
  // selectedValue 是数组 ['2023', '01', '01']
  if (selectedValue && selectedValue.length >= 3) {
      const [y, m, d] = selectedValue
      // 格式化为 YYYY-MM-DD
      form.birthdate = `${y}-${m}-${d}`
  } else {
      // 降级处理，使用 currentData
      form.birthdate = formatDate(currentDate.value)
  }
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
    const d = resp.data as any
    form.username = d.username || ''
    form.nickname = d.nickname || ''
    form.email = d.email || ''
    form.avatar = d.avatar || ''
    form.bio = d.bio || ''
    form.gender = (d.gender || 'male') as any
    form.birthdate = (d.birthdate || '') as any
    
    // 设置性别回显
    const idx = genderValues.indexOf(form.gender)
    genderIndex.value = idx >= 0 ? idx : 0
    
    avatarPreview.value = getUploadUrl(form.avatar)
  }
})

const handleSubmit = async () => {
  const uid = auth.user?.id as string
  const resp = await userService.updateProfile(uid, {
    nickname: form.nickname || undefined,
    email: form.email || undefined,
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
    // 如果用户在 chooseImage 中点击取消，会抛出异常或返回空数组
    if (!choose.tempFilePaths || choose.tempFilePaths.length === 0) {
      return
    }
    
    const filePath = choose.tempFilePaths[0]
    // 添加 loading 提示
    Taro.showLoading({ title: '上传中...' })
    
    try {
      const uploaded = await materialService.uploadMaterialAsUser(filePath, { is_public: true })
      // 以相对路径存库，前端展示拼接 BASE
      const path = (uploaded as any).file_path || (uploaded as any).path || ''
      if (path) {
        form.avatar = path
        avatarPreview.value = getUploadUrl(path)
        Taro.showToast({ title: '头像已更新，记得保存', icon: 'none' })
      } else {
        throw new Error('上传返回数据异常')
      }
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      Taro.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  } catch (e: any) {
    // 用户取消选择图片通常会抛出 errMsg: "chooseImage:fail cancel"
    if (e.errMsg && e.errMsg.includes('cancel')) {
      console.log('用户取消选择图片')
      return
    }
    console.error('Choose image error:', e)
    Taro.showToast({ title: '选择图片失败', icon: 'none' })
  }
}
</script>

<style lang="scss">
.profile-detail-page { 
  padding-top: 0; 
  min-height: 100vh;
  background: $style-color-bg;
}
.content { padding: $style-spacing-sm; }

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  
  .avatar-label {
    margin-top: 8px;
    font-size: $style-text-size-sm;
    color: $style-color-primary;
  }
}

.readonly-text {
  color: $style-text-color-regular;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: $style-text-color-primary; /* 确保默认为深色 */
  
  .placeholder {
    color: #ccc; /* 仅在 placeholder 状态下显示灰色 */
  }
}

/* 恢复 NutUI 默认样式 */
.nut-date-picker {
  /* 确保不隐藏默认标题 */
  .nut-picker__title {
     display: block; 
  }
}

.mt-16 { margin-top: 16px; }
</style>


