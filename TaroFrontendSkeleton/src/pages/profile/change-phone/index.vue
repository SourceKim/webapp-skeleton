<template>
  <view class="change-phone-page">
    <nut-navbar title="修改手机号" left-show safe-area-inset-top @on-click-back="goBack" />
    
    <view class="form-container">
      <view class="current-phone" v-if="currentPhone">
        当前手机号：{{ currentPhone }}
      </view>
      <nut-form>
        <nut-form-item label="新手机号">
          <nut-input v-model="form.phone" placeholder="请输入新手机号" type="number" />
        </nut-form-item>
        <nut-form-item label="登录密码">
          <nut-input v-model="form.password" placeholder="请输入登录密码验证身份" type="password" />
        </nut-form-item>
      </nut-form>

      <nut-button type="primary" block class="mt-20" :loading="loading" @click="submit">确认修改</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import userService from '@/services/user'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const currentPhone = ref('')
const form = reactive({
  phone: '',
  password: ''
})
const loading = ref(false)

onMounted(async () => {
  if (auth.user?.phone) {
    // 简单的脱敏处理，如 138****1234
    const p = auth.user.phone
    currentPhone.value = p.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
})

const goBack = () => Taro.navigateBack()

const validate = () => {
  if (!form.phone) return '请输入新手机号'
  if (!/^1[3-9]\d{9}$/.test(form.phone)) return '手机号格式不正确'
  if (!form.password) return '请输入登录密码'
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
    const res = await userService.changePhone({
      phone: form.phone,
      password: form.password
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
.change-phone-page {
  min-height: 100vh;
  background: $style-color-bg;
  padding-top: 0;
}
.form-container {
  padding: $style-spacing-base;
}
.current-phone {
  padding: 0 16px 16px;
  font-size: 14px;
  color: $style-text-color-secondary;
}
.mt-20 {
  margin-top: 20px;
}
</style>
