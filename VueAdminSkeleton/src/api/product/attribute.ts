import createAxios from '@/utils/request'
import type { RequestOption, RestResponse } from '../types/common'
import type { ProductAttributeKey, ProductAttributeValue } from './attribute.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getAttributeKeys(spuId: string, option?: RequestOption): RestResponse<ProductAttributeKey[]> {
  return createAxios(option).get(`${BASE_URL}/products/attributes/keys`, { params: { spuId } })
}

export function createAttributeKey(data: Partial<ProductAttributeKey> & { spu_id: string }, option?: RequestOption): RestResponse<ProductAttributeKey> {
  return createAxios(option).post(`${BASE_URL}/products/attributes/admin/keys`, data)
}
export function updateAttributeKey(id: string, data: Partial<ProductAttributeKey>, option?: RequestOption): RestResponse<ProductAttributeKey> {
  return createAxios(option).put(`${BASE_URL}/products/attributes/admin/keys/${id}`, data)
}
export function deleteAttributeKey(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/attributes/admin/keys/${id}`)
}

export function createAttributeValue(data: Partial<ProductAttributeValue> & { attribute_key_id: string }, option?: RequestOption): RestResponse<ProductAttributeValue> {
  return createAxios(option).post(`${BASE_URL}/products/attributes/admin/values`, data)
}
export function updateAttributeValue(id: string, data: Partial<ProductAttributeValue>, option?: RequestOption): RestResponse<ProductAttributeValue> {
  return createAxios(option).put(`${BASE_URL}/products/attributes/admin/values/${id}`, data)
}
export function deleteAttributeValue(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/attributes/admin/values/${id}`)
}


