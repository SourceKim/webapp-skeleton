import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductBrandDto, ProductBrand, UpdateProductBrandDto } from './brand.d'

export function getBrands(option?: RequestOption): RestResponse<PaginatedResponse<ProductBrand>> {
  return createAxios(option).get(`/products/brands`)
}

export function getBrandById(id: string, option?: RequestOption): RestResponse<ProductBrand> {
  return createAxios(option).get(`/products/brands/${id}`)
}

export function createBrand(data: CreateProductBrandDto, option?: RequestOption): RestResponse<ProductBrand> {
  return createAxios(option).post(`/products/brands/admin`, data)
}

export function updateBrand(id: string, data: UpdateProductBrandDto, option?: RequestOption): RestResponse<ProductBrand> {
  return createAxios(option).put(`/products/brands/admin/${id}`, data)
}

export function deleteBrand(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`/products/brands/admin/${id}`)
}

// 便于弹窗选择品牌：支持传入查询参数（如 { limit: 100 }）
export function getBrandsAll(params?: Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<ProductBrand>> {
  return createAxios(option).get(`/products/brands`, { params })
}


