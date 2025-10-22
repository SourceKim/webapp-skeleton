import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
import { authService, type UserInfo } from '../services'

interface State {
  token: string | null
  user: UserInfo | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    token: null,
    user: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    loadFromStorage() {
      const t = Taro.getStorageSync('token') as string | undefined
      if (t) this.token = t
    },
    async autoLoginByToken() {
      this.loadFromStorage()
      if (!this.token) return { ok: false, reason: 'no-token' as const }
      const resp = await authService.tokenLogin()
      if (resp.code === 0 && resp.data) {
        // 按登录成功对齐：刷新 token + 用户
        try { Taro.setStorageSync('token', resp.data.access_token) } catch {}
        this.token = resp.data.access_token
        this.user = resp.data.user
        return { ok: true as const }
      }
      // token 失效：清理并引导登录
      try { Taro.removeStorageSync('token') } catch {}
      this.token = null
      this.user = null
      return { ok: false, reason: 'invalid-token' as const, message: resp.message }
    },
    async refreshProfile() {
      if (!this.token) return
      const resp = await authService.getCurrentUser()
      if (resp.code === 0 && resp.data) {
        this.user = resp.data
      }
    },
    setToken(token: string | null) {
      this.token = token
    },
    setUser(user: UserInfo | null) {
      this.user = user
    },
    logout() {
      authService.logout()
      this.token = null
      this.user = null
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  }
})


