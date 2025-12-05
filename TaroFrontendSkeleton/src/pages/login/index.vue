<template>
  <view class="login-container">
    <template v-if="isRegister">
      <nut-navbar title="注册" safe-area-inset-top />
      <view class="card">
        <text class="login-title">创建账号</text>
        <nut-form>
          <nut-form-item label="用户名">
            <input class="nut-input" v-model="username" placeholder="请输入用户名" />
          </nut-form-item>
          <nut-form-item label="密码">
            <input class="nut-input" v-model="password" placeholder="请输入密码" password />
          </nut-form-item>
          <nut-form-item label="邮箱（可选）">
            <input class="nut-input" v-model="email" placeholder="请输入邮箱" />
          </nut-form-item>
          <nut-form-item label="手机号">
            <input class="nut-input" v-model="phone" placeholder="请输入手机号" />
          </nut-form-item>
          <nut-form-item label="昵称">
            <input class="nut-input" v-model="nickname" placeholder="请输入昵称" />
          </nut-form-item>
          <nut-form-item label="性别">
            <picker mode="selector" :range="genderOptionsCN" :value="genderIndex" @change="onGenderChange">
              <view class="picker-display">
                <text>{{ genderOptionsCN[genderIndex] }}</text>
                <nut-icon name="right" size="12" color="#999" />
              </view>
            </picker>
          </nut-form-item>
          <nut-form-item label="出生日期（可选）">
            <view class="picker-display" @click="openBirthPicker">
              <text :class="{ placeholder: !birthdate }">{{ birthdate || '请选择出生年月日' }}</text>
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
          <nut-form-item label="简介（可选）">
            <textarea class="nut-textarea" v-model="bio" placeholder="请输入个人简介" />
          </nut-form-item>
        </nut-form>
        <nut-button type="primary" block :loading="loading" @click="handleSubmit">{{ loading ? '注册中...' : '注册' }}</nut-button>
        <nut-button type="info" plain block class="mt-10" @click="toggleMode">已有账号？去登录</nut-button>
      </view>
    </template>
    <template v-else>
      <nut-navbar title="登录" safe-area-inset-top />
      <view class="card">
        <text class="login-title">欢迎回来</text>
        <nut-form>
          <nut-form-item label="用户名">
            <input class="nut-input" v-model="username" placeholder="请输入用户名" />
          </nut-form-item>
          <nut-form-item label="密码">
            <input class="nut-input" v-model="password" placeholder="请输入密码" password />
          </nut-form-item>
        </nut-form>
        <nut-button type="primary" block :loading="loading" @click="handleSubmit">{{ loading ? '登录中...' : '登录' }}</nut-button>
        <nut-button type="info" plain block class="mt-10" @click="toggleMode">没有账号？去注册</nut-button>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Taro from '@tarojs/taro'
import { authService } from '../../services'
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
const genderOptionsCN = ['男', '女', '保密']
const genderIndex = ref(0)
const onGenderChange = (e: any) => { genderIndex.value = Number(e.detail.value) }

// 出生日期选择器
const showBirthPicker = ref(false)
const currentDate = ref(new Date())
const minBirthDate = new Date(1900, 0, 1)
const maxBirthDate = new Date()

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const openBirthPicker = () => {
  if (birthdate.value) {
    currentDate.value = new Date(birthdate.value)
  }
  showBirthPicker.value = true
}

const applyBirth = ({ selectedValue }: any) => {
  if (selectedValue && selectedValue.length >= 3) {
      const [y, m, d] = selectedValue
      birthdate.value = `${y}-${m}-${d}`
  } else {
      birthdate.value = formatDate(currentDate.value)
  }
  showBirthPicker.value = false
}

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
</script>

<style lang="scss">
.login-container { padding: 20px; }
.card { background: $style-color-white; border-radius: 12px; padding: $style-spacing-sm; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.login-title { display:block; font-size: 20px; font-weight: 600; margin-bottom: 12px; }
.nut-input { width: 100%; padding: 10px 12px; border: 1px solid $style-border-color; border-radius: 8px; background: $style-color-bg; }
.nut-textarea { width: 100%; min-height: 80px; padding: 10px 12px; border: 1px solid $style-border-color; border-radius: 8px; background: $style-color-bg; }
.picker-display { 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px; 
  border: 1px solid $style-border-color; 
  border-radius: 8px; 
  background: $style-color-bg; 
  color: $style-text-color-primary; 
  
  .placeholder {
    color: #ccc;
  }
}
/* 恢复 NutUI 默认样式 */
.nut-date-picker {
  .nut-picker__title {
     display: block; 
  }
}
.mt-10 { margin-top: 10px; }
</style>


