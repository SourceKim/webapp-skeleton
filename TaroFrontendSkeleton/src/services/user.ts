import api from './api'
import type { UserInfo } from './auth'

export interface UpdateProfileParams {
  username?: string
  password?: string
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  bio?: string
  gender?: 'male' | 'female' | 'other'
  birthdate?: string
}

const userService = {
  // 获取用户资料（需要登录）
  getProfile: (id: string) => {
    return api.get<UserInfo>(`/users/profile/${id}`)
  },

  // 更新用户资料（需要登录）
  updateProfile: (id: string, data: UpdateProfileParams) => {
    return api.put<UserInfo>(`/users/profile/${id}` , data)
  },

  // 获取用户统计数据
  getStats: () => {
    return api.get<{ couponCount: number; pointCount: number; totalConsumption: string }>('/users/stats')
  },

  // 修改密码
  changePassword: (data: any) => {
    return api.put('/users/change-password', data)
  },

  // 修改手机号
  changePhone: (data: any) => {
    return api.put('/users/change-phone', data)
  }
}

export default userService
export type { UserInfo }
