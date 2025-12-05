<template>
  <view class="change-password-page">
    <nut-navbar title="修改密码" left-show safe-area-inset-top @on-click-back="goBack" />
    
    <view class="form-container">
      <nut-form>
        <nut-form-item label="旧密码">
          <nut-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password" />
        </nut-form-item>
        <nut-form-item label="新密码">
          <nut-input v-model="form.newPassword" placeholder="请输入新密码（至少6位）" type="password" />
        </nut-form-item>
        <nut-form-item label="确认新密码">
          <nut-input v-model="form.confirmPassword" placeholder="请再次输入新密码" type="password" />
        </nut-form-item>
      </nut-form>

      <nut-button type="primary" block class="mt-20" :loading="loading" @click="submit">确认修改</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import userService from '@/services/user'

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)

const goBack = () => Taro.navigateBack()

const validate = () => {
  if (!form.oldPassword) return '请输入旧密码'
  if (!form.newPassword) return '请输入新密码'
  if (form.newPassword.length < 6) return '新密码长度不能少于6位'
  if (form.newPassword !== form.confirmPassword) return '两次输入的密码不一致'
  return ''
}

const submit = async () => {
  const msg = validate()
  if (msg) {
    Taro.showToast({ title: msg, icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await userService.changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    })
    if (res.code === 0) {
      Taro.showToast({ title: '修改成功', icon: 'success' })
      setTimeout(() => {
        goBack()
      }, 1500)
    } else {
      Taro.showToast({ title: res.message || '修改失败', icon: 'none' })
    }
  } catch (e) {
    Taro.showToast({ title: '操作异常', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
.change-password-page {
  min-height: 100vh;
  background: $style-color-bg;
  padding-top: 0;
}
.form-container {
  padding: $style-spacing-base;
}
.mt-20 {
  margin-top: 20px;
}
</style>
