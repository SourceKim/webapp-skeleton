<template>
    <el-scrollbar
      height="100%"
      class="login-root"
      :class="{
        dark: layoutStore.darkMode
      }"
    >
      <div class="image-bg" />
      <div class="login-view">
        <div class="action-view">
          <SwitchLocale />
          <SwitchStyle />
        </div>
        <div class="card-view">
          <div class="title-system">{{ title }}</div>
          <el-form class="form-view" @keyup.enter="submit" ref="formRef" :rules="rules" size="large" :model="formData">
            <el-form-item prop="username">
              <el-input
                type="text"
                clearable
                v-model="formData.username"
                :placeholder="t('system.login.inputUsername')"
                prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                :placeholder="t('system.login.inputPassword')"
                show-password
                clearable
                prefix-icon="Unlock"
              />
            </el-form-item>
            <!--          <div class="forget-password-view">-->
            <!--            <el-link type="primary" icon="QuestionFilled"> 忘记密码</el-link>-->
            <!--          </div>-->
            <el-button :loading="loading" class="submit-button" round type="primary" size="large" @click="submit">
              {{ t('system.login.login') }}
            </el-button>
          </el-form>
        </div>
        <Footer class="footer" />
      </div>
    </el-scrollbar>
  </template>
  <script setup>
  import { computed, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import SwitchStyle from '@/layout/Action/SwitchStyle.vue'
  import SwitchLocale from '@/layout/Action/SwitchLocale.vue'
  import Footer from '@/layout/Footer.vue'
  import { useI18n } from 'vue-i18n'
  import { login } from '@/api/auth'
  import { useLayoutStore } from '@/stores/layout'
  import { useMenuStore } from '@/stores/menu'
  import { useAuthStore } from '@/stores/auth'
  import { ENV } from '@/utils/env'
  import { loginSchema } from '@skeleton/shared-types'
  import { validateFormErrors } from '@/utils/zod-validator'
  import { ElMessage } from 'element-plus'

  defineOptions({
    name: 'SystemLogin'
  })
  
  const { t } = useI18n()
  
  const title = ENV.TITLE
  const layoutStore = useLayoutStore()
  const router = useRouter()
  
  const loading = ref(false)
  const formData = reactive({
    username: '',
    password: '',
  })
  
  const rules = computed(() => ({
    username: [{ required: true, message: t('system.login.inputUsername') }],
    password: [{ required: true, message: t('system.login.inputPassword') }],
  }))
  
  const formRef = ref()
  
  function submit() {
    // 先使用 Element Plus 表单验证
    formRef.value.validate((valid) => {
      if (!valid) {
        return
      }
      
      // 使用 Zod Schema 进行二次验证（确保前后端验证规则一致）
      const errors = validateFormErrors(loginSchema, formData)
      if (errors) {
        // 显示 Zod 验证错误
        Object.values(errors).forEach(msg => {
          ElMessage.error(msg)
        })
        return
      }
      
      useAuthStore().token = ''
      login(
        {
          ...formData
        },
        {
          loadingRef: loading, // vue3中的ref,可以动态更新此值
          showSuccessMsg: true,
          successMsg: (res) => '登录成功！欢迎你，尊敬的' + res.data.user.name, // 成功的提示信息
          errorMsg: '登录失败' // 失败的提示信息
        }
      ).then((res) => {
        const data = res.data
        console.log('登录成功', data)
        useAuthStore().token = data.access_token
        useAuthStore().loginState = 'success'
        useAuthStore().user = data.user
        const firstRoute = useMenuStore().getFirstRoute()
        console.log('firstRoute', firstRoute)
        router.replace(firstRoute.fullPath)
      }).catch((err) => {
        console.log('登录失败', err)
      })
    })
  }
  
  </script>
  <style scoped lang="scss">
  .login-root {
    height: 100%;
  
    .image-bg {
      position: fixed;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/bg.jpg');
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  
  .login-view {
    position: relative;
    min-height: 100vh;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  
    .action-view {
      align-self: end;
      margin-top: 20px;
      margin-right: 20px;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  
    .title-system {
      font-size: 30px;
      font-weight: bold;
      color: white;
      z-index: 1;
      text-align: center;
      margin: 30px 0 40px 0;
    }
  
    .card-view {
      z-index: 5;
      border-radius: 10px;
      //box-shadow: var(--el-box-shadow);
      padding: 20px;
      position: relative;
      width: min(350px, 80%);
      background: rgba(0, 0, 0, 0.2);
      margin-top: calc((100vh - 450px) / 2);
  
      .form-view {
        .forget-password-view {
          font-size: 10px;
          text-align: right;
          margin-bottom: 20px;
        }
  
        :deep(.el-input-group__append) {
          padding: 4px;
        }
  
        .captcha-img {
          margin: 2px 0 2px 5px;
          width: 100px;
          height: var(--el-component-size);
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 5px;
          display: flex;
          align-items: center;
          background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  
          > * {
            width: 100%;
            height: 100%;
          }
        }
  
        .submit-button {
          width: 100%;
        }
      }
    }
  }
  
  .dark {
    .image-bg {
      opacity: 0.4;
    }
  
    .login-view {
      .card-view {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
  
  .width-layout-shrink {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  
    .card-view {
      background-color: inherit;
      margin-top: 20px;
      position: relative;
      inset: auto;
      width: auto;
    }
  }
  
  .footer {
    z-index: 1;
    position: absolute;
    bottom: 0;
    padding: 10px 10px;
  }
  </style>
  