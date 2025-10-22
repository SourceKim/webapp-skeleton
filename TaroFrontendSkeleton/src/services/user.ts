import api from './api'
import type { UserInfo } from './auth'

export interface UpdateProfileParams {
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  bio?: string
}

const userService = {
  // 获取用户资料（需要登录）
  getProfile: (id: string) => {
    return api.get<UserInfo>(`/users/profile/${id}`)
  },

  // 更新用户资料（需要登录）
  updateProfile: (id: string, data: UpdateProfileParams) => {
    return api.put<UserInfo>(`/users/profile/${id}` , data)
  }
}

export default userService
export type { UserInfo }

