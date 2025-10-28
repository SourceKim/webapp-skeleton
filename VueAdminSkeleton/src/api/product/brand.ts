import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductBrandDto, ProductBrand, UpdateProductBrandDto } from './brand.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getBrands(option?: RequestOption): RestResponse<PaginatedResponse<ProductBrand>> {
  return createAxios(option).get(`${BASE_URL}/products/brands`)
}

export function getBrandById(id: string, option?: RequestOption): RestResponse<ProductBrand> {
  return createAxios(option).get(`${BASE_URL}/products/brands/${id}`)
}

export function createBrand(data: CreateProductBrandDto, option?: RequestOption): RestResponse<ProductBrand> {
  return createAxios(option).post(`${BASE_URL}/products/brands/admin`, data)
}

export function updateBrand(id: string, data: UpdateProductBrandDto, option?: RequestOption): RestResponse<ProductBrand> {
  return createAxios(option).put(`${BASE_URL}/products/brands/admin/${id}`, data)
}

export function deleteBrand(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/brands/admin/${id}`)
}


