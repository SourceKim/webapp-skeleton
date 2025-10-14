import { defineStore } from 'pinia'
import type { User } from '@/interface/auth'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'
import { login as loginApi, tokenLogin as tokenLoginApi } from '@/api/auth'
import { useRouterStore } from './router'

type loginState = 'success' | 'failed'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = useLocalStorage('token', '')
    const loginState = ref<loginState | undefined>(undefined)

    async function login(data: any) {
        try {
            const res: any = await loginApi(data)
            if (res.code === 200) {
                loginState.value = 'success'
                token.value = res.data.token
                user.value = res.data.user
                return true
            } else {
                loginState.value = 'failed'
                return false
            }
        } catch (error) {
            console.error('登录失败:', error)
            loginState.value = 'failed'
            return false
        }
    }

    async function tokenLogin(): Promise<boolean> {
        try {
            const res: any = await tokenLoginApi({})
            if (res.code === 0) {
                token.value = res.data.access_token
                loginState.value = 'success'
                user.value = res.data.user
                console.log('token登录成功', res, user.value, token.value)
                return true
            } else {
                loginState.value = 'failed'
                return false
            }
        } catch (error) {
            console.error('token登录失败:', error)
            loginState.value = 'failed'
            // 清空可能过期的token
            token.value = ''
            user.value = null
            return false
        }
    }

    async function logout() {
        loginState.value = 'failed'
        token.value = ''
        user.value = null
        useRouterStore().jumpTo('/login')
    }
    return {
        user,
        token,
        loginState,
        tokenLogin,
        login,
        logout
    }
})