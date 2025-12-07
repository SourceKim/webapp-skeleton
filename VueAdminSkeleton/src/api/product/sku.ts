import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductSkuDto, ProductSku, UpdateProductSkuDto } from './sku.d'

export function getSkuList(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<ProductSku>> {
  return createAxios(option).get(`/products/sku`, { params })
}

export function createSku(data: CreateProductSkuDto, option?: RequestOption): RestResponse<ProductSku> {
  return createAxios(option).post(`/products/sku/admin`, data)
}

export function updateSku(id: string, data: UpdateProductSkuDto, option?: RequestOption): RestResponse<ProductSku> {
  return createAxios(option).put(`/products/sku/admin/${id}`, data)
}

export function deleteSku(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`/products/sku/admin/${id}`)
}

export function generateSkus(spuId: string, items: Array<Partial<CreateProductSkuDto> & { attribute_value_ids?: string[] }>, option?: RequestOption): RestResponse<{ count: number }> {
  return createAxios(option).post(`/products/spu/admin/${spuId}/generate-skus`, { items })
}


