import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { UpdateUserAddressDto, UserAddress } from './address.d'

export function listAdminAddresses(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<UserAddress>> {
  return createAxios(option).get(`/addresses/admin`, { params })
}

export function getAdminAddressById(id: string, option?: RequestOption): RestResponse<UserAddress> {
  return createAxios(option).get(`/addresses/admin/${id}`)
}

export function updateAdminAddress(id: string, data: UpdateUserAddressDto, option?: RequestOption): RestResponse<UserAddress> {
  return createAxios(option).put(`/addresses/admin/${id}`, data)
}

export function deleteAdminAddress(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`/addresses/admin/${id}`)
}


