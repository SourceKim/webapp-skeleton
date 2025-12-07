import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductSpuDto, ProductSpu, UpdateProductSpuDto } from './spu.d'

export function getSpuList(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<ProductSpu>> {
  return createAxios(option).get(`/products/spu`, { params })
}

export function getSpuById(id: string, option?: RequestOption): RestResponse<ProductSpu> {
  return createAxios(option).get(`/products/spu/${id}`)
}

export function createSpu(data: CreateProductSpuDto, option?: RequestOption): RestResponse<ProductSpu> {
  return createAxios(option).post(`/products/spu/admin`, data)
}

export function updateSpu(id: string, data: UpdateProductSpuDto, option?: RequestOption): RestResponse<ProductSpu> {
  return createAxios(option).put(`/products/spu/admin/${id}`, data)
}

export function deleteSpu(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`/products/spu/admin/${id}`)
}


