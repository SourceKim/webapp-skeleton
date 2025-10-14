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


