import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { UpdateUserAddressDto, UserAddress } from './address.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function listAdminAddresses(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<UserAddress>> {
  return createAxios(option).get(`${BASE_URL}/addresses/admin`, { params })
}

export function getAdminAddressById(id: string, option?: RequestOption): RestResponse<UserAddress> {
  return createAxios(option).get(`${BASE_URL}/addresses/admin/${id}`)
}

export function updateAdminAddress(id: string, data: UpdateUserAddressDto, option?: RequestOption): RestResponse<UserAddress> {
  return createAxios(option).put(`${BASE_URL}/addresses/admin/${id}`, data)
}

export function deleteAdminAddress(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/addresses/admin/${id}`)
}


