import createAxios from '@/utils/request'
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common'
import type { CreateProductDto, Product, UpdateProductDto } from './product.d'

export function getProducts(option?: RequestOption): RestResponse<PaginatedResponse<Product>> {
  return createAxios(option).get(`/products/admin`)
}

export function getProductById(id: string, option?: RequestOption): RestResponse<Product> {
  return createAxios(option).get(`/products/admin/${id}`)
}

export function createProduct(data: CreateProductDto, option?: RequestOption): RestResponse<Product> {
  return createAxios(option).post(`/products/admin`, data)
}

export function updateProduct(id: string, data: UpdateProductDto, option?: RequestOption): RestResponse<Product> {
  return createAxios(option).put(`/products/admin/${id}`, data)
}

export function deleteProduct(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`/products/admin/${id}`)
}


