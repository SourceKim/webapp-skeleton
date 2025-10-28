import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductCategoryDto, ProductCategory, UpdateProductCategoryDto } from './category.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getCategories(params?: { parent_id?: string | null; level?: number }, option?: RequestOption): RestResponse<PaginatedResponse<ProductCategory>> {
  const query: any = {}
  if (params?.parent_id === null) query.parent_id = 'null'
  else if (params?.parent_id) query.parent_id = params.parent_id
  if (typeof params?.level === 'number') query.level = params.level
  return createAxios(option).get(`${BASE_URL}/products/categories`, { params: query })
}

export function getCategoryById(id: string, option?: RequestOption): RestResponse<ProductCategory> {
  return createAxios(option).get(`${BASE_URL}/products/categories/${id}`)
}

export function createCategory(data: CreateProductCategoryDto, option?: RequestOption): RestResponse<ProductCategory> {
  return createAxios(option).post(`${BASE_URL}/products/categories/admin`, data)
}

export function updateCategory(id: string, data: UpdateProductCategoryDto, option?: RequestOption): RestResponse<ProductCategory> {
  return createAxios(option).put(`${BASE_URL}/products/categories/admin/${id}`, data)
}

export function deleteCategory(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/categories/admin/${id}`)
}


