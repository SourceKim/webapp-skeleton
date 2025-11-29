import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductCategoryDto, ProductCategory, UpdateProductCategoryDto } from './category.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getCategories(params?: { parent_id?: string | null; level?: number } & Record<string, any>, option?: RequestOption): RestResponse<PaginatedResponse<ProductCategory>> {
  const query: any = { ...params }
  if (params?.parent_id === null) query.parent_id = 'null'
  else if (params?.parent_id) query.parent_id = params.parent_id
  
  // 如果有 filters 对象，需要确保它是对象格式，axios 会自动序列化为 filters[key]=value
  // 但要注意：如果在 params 中直接传 filters: { brand_id: xxx }，axios 默认行为是 filters[brand_id]=xxx，这是符合预期的
  
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


