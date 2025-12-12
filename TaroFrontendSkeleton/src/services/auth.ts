import api from './api'
import Taro from '@tarojs/taro'
import type { User, UserGender, UserStatus } from '@skeleton/shared-types'

// 重新导出枚举类型
export type { UserGender, UserStatus } from '@skeleton/shared-types'

// 用户登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 用户注册请求参数
export type Gender = UserGender

export interface RegisterParams {
  username: string
  password: string
  phone: string
  nickname: string
  gender: Gender
  birthdate?: string
  email?: string
  avatar?: string
  bio?: string
}

// 用户信息响应（扩展 User 接口，添加前端特定字段）
export interface UserInfo extends User {
  is_active?: boolean
  roles?: Array<{
    id: string
    name: string
    description?: string
  }>
}

// 登录响应
export interface LoginResponse {
  access_token: string
  user: UserInfo
}

// 认证服务
const authService = {
  // 用户登录
  login: (params: LoginParams) => {
    console.log('登录请求参数:', params)
    return api.post<{ access_token: string, user: UserInfo }>('/auth/login', params)
      .then(response => {
        console.log('登录响应:', response)
        if (response.code === 0 && response.data) {
          // 保存token
          Taro.setStorageSync('token', response.data.access_token)
        }
        return response
      })
      .catch(error => {
        console.error('登录请求错误:', error)
        return {
          code: -1,
          message: '登录请求失败',
          data: null as any
        }
      })
  },

  // 微信登录（当前后端未实现，占位提示）
  wxLogin: async (code: string) => {
    console.log('微信登录请求参数:', { code })
    Taro.showToast({ title: '微信登录暂未开通', icon: 'none' })
    return Promise.resolve({ code: -1, message: '未实现', data: null as any })
  },

  // 用户注册
  register: (params: RegisterParams) => {
    return api.post<UserInfo>('/auth/register', params)
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    console.log('获取当前用户信息')
    return api.get<UserInfo>('/auth/profile')
      .then(response => {
        console.log('获取当前用户信息响应:', response)
        return response
      })
      .catch(error => {
        console.error('获取当前用户信息错误:', error)
        return {
          code: -1,
          message: '获取用户信息失败',
          data: null as any
        }
      })
  },

  // token 登录：与 login 返回结构保持一致 { access_token, user }
  tokenLogin: async () => {
    try {
      const token = Taro.getStorageSync('token')
      if (!token) {
        return { code: 401, message: '未登录', data: null as any }
      }
      const resp = await api.post<{ access_token: string, user: UserInfo }>('/auth/token-login')
      return resp
    } catch (error) {
      console.error('token-login 请求错误:', error)
      return { code: -1, message: 'token 登录失败', data: null as any }
    }
  },

  // 刷新令牌
  refreshToken: () => {
    return api.post<{ access_token: string }>('/auth/refresh-token')
      .then(response => {
        if (response.code === 0 && response.data) {
          // 更新token
          Taro.setStorageSync('token', response.data.access_token)
        }
        return response
      })
  },

  // 用户登出（前端本地清除）
  logout: async () => {
    console.log('用户登出')
    Taro.removeStorageSync('token')
    return { code: 0, message: '已退出登录', data: null as any }
  },

  // 修改密码
  changePassword: (oldPassword: string, newPassword: string) => {
    return api.post('/auth/change-password', { oldPassword, newPassword })
  },

  // 忘记密码
  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email })
  },

  // 重置密码
  resetPassword: (token: string, password: string) => {
    return api.post('/auth/reset-password', { token, password })
  },

  // 更新用户资料
  updateProfile: (data: {
    email?: string,
    phone?: string,
    nickname?: string,
    avatar?: string,
    bio?: string
  }) => {
    return api.put<UserInfo>('/auth/update-profile', data)
  }
}

export default authService 