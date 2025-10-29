import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductSkuDto, ProductSku, UpdateProductSkuDto } from './sku.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getSkuList(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<ProductSku>> {
  return createAxios(option).get(`${BASE_URL}/products/sku`, { params })
}

export function createSku(data: CreateProductSkuDto, option?: RequestOption): RestResponse<ProductSku> {
  return createAxios(option).post(`${BASE_URL}/products/sku/admin`, data)
}

export function updateSku(id: string, data: UpdateProductSkuDto, option?: RequestOption): RestResponse<ProductSku> {
  return createAxios(option).put(`${BASE_URL}/products/sku/admin/${id}`, data)
}

export function deleteSku(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/sku/admin/${id}`)
}

export function generateSkus(spuId: string, items: Array<Partial<CreateProductSkuDto> & { attribute_value_ids?: string[] }>, option?: RequestOption): RestResponse<{ count: number }> {
  return createAxios(option).post(`${BASE_URL}/products/spu/admin/${spuId}/generate-skus`, { items })
}


