import type { BaseModel } from '../types/common'

export type AddressTag = 'HOME' | 'COMPANY' | 'SCHOOL' | 'OTHER'
export type AddressStatus = 'ACTIVE' | 'INACTIVE'

export interface UserAddress extends BaseModel {
  user_id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  postal_code?: string
  is_default: boolean
  tag?: AddressTag
  status: AddressStatus
}

export type UpdateUserAddressDto = Partial<Omit<UserAddress, keyof BaseModel | 'user_id'>>


