import api from './api'

export interface AddressItem {
  id: string
  user_id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  postal_code?: string
  is_default: boolean
  tag?: 'HOME' | 'COMPANY' | 'SCHOOL' | 'OTHER'
  status: 'ACTIVE' | 'INACTIVE'
}

const addressService = {
  list: () => api.get<AddressItem[]>(`/addresses`),
  detail: (id: string) => api.get<AddressItem>(`/addresses/${id}`),
  create: (data: Partial<AddressItem>) => api.post<AddressItem>(`/addresses`, data),
  update: (id: string, data: Partial<AddressItem>) => api.put<AddressItem>(`/addresses/${id}`, data),
  remove: (id: string) => api.delete<void>(`/addresses/${id}`),
  setDefault: (id: string) => api.put<void>(`/addresses/${id}/default`)
}

export default addressService
export type { AddressItem }


