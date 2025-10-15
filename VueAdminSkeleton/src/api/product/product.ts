import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductDto, Product, UpdateProductDto } from './product.d'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

export function getProducts(option?: RequestOption): RestResponse<PaginatedResponse<Product>> {
  return createAxios(option).get(`${BASE_URL}/products/admin`)
}

export function getProductById(id: string, option?: RequestOption): RestResponse<Product> {
  return createAxios(option).get(`${BASE_URL}/products/admin/${id}`)
}

export function createProduct(data: CreateProductDto, option?: RequestOption): RestResponse<Product> {
  return createAxios(option).post(`${BASE_URL}/products/admin`, data)
}

export function updateProduct(id: string, data: UpdateProductDto, option?: RequestOption): RestResponse<Product> {
  return createAxios(option).put(`${BASE_URL}/products/admin/${id}`, data)
}

export function deleteProduct(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${BASE_URL}/products/admin/${id}`)
}


