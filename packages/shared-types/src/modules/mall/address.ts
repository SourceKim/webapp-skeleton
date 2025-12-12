/**
 * 用户地址相关类型定义
 */
import { BaseEntity } from '../../base'
import { UserAddressTag, UserAddressStatus } from './enums'
import type { User } from '../user'

/**
 * 用户地址实体接口
 */
export interface UserAddress extends BaseEntity {
  user_id: string
  user?: User // 关联用户
  name: string
  phone: string
  province: string
  city: string
  country: string
  town?: string
  detail: string
  postal_code?: string
  is_default: boolean
  tag?: UserAddressTag
  status: UserAddressStatus
}
