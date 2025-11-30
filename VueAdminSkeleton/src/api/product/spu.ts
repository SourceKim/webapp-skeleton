import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductSpuDto, ProductSpu, UpdateProductSpuDto } from './spu.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getSpuList(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<ProductSpu>> {
  return createAxios(option).get(`${BASE_URL}/products/spu`, { params })
}

export function getSpuById(id: string, option?: RequestOption): RestResponse<ProductSpu> {
  return createAxios(option).get(`${BASE_URL}/products/spu/${id}`)
}

export function createSpu(data: CreateProductSpuDto, option?: RequestOption): RestResponse<ProductSpu> {
  return createAxios(option).post(`${BASE_URL}/products/spu/admin`, data)
}

export function updateSpu(id: string, data: UpdateProductSpuDto, option?: RequestOption): RestResponse<ProductSpu> {
  return createAxios(option).put(`${BASE_URL}/products/spu/admin/${id}`, data)
}

export function deleteSpu(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/spu/admin/${id}`)
}


