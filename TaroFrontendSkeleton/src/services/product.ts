import api, { BASE_URL } from './api'
import type { Material } from '@skeleton/shared-types'

// 与后端 ProductDTO 对齐的产品模型
export interface ProductMaterialRef {
  id: string
  filename?: string
  file_path?: string
  type?: string
}

export type ProductStatus = 'active' | 'inactive'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  status: ProductStatus
  category_id?: string
  materials?: ProductMaterialRef[]
  createdAt?: string | Date
  updatedAt?: string | Date
  deletedAt?: string | Date | null
}

// 创建/更新参数与后端 DTO 对齐
export interface CreateProductParams {
  name: string
  description?: string
  price: number
  stock: number
  status: ProductStatus
  category_id?: string
  material_ids?: string[]
}

export interface UpdateProductParams {
  name?: string
  description?: string
  price?: number
  stock?: number
  status?: ProductStatus
  category_id?: string
  material_ids?: string[]
}

// 查询参数（分页中间件支持 sort 与 filters）
import type { PaginationQuery, PaginatedResponse } from '@skeleton/shared-types'

export interface ProductQueryParams extends PaginationQuery {
  filters?: Record<string, any>
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  pages: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

// 扩展 PaginatedResponse，使用本地的 meta 结构
export interface PaginatedProductsResponse extends Omit<PaginatedResponse<Product>, 'meta'> {
  items: Product[]
  meta: PaginatedMeta
}

// 工具：根据 material.file_path 生成可访问 URL
export const getMaterialUrl = (filePath?: string): string | undefined => {
  if (!filePath) return undefined
  const host = BASE_URL.replace(/\/?api\/v1$/, '')
  if (filePath.startsWith('http')) return filePath
  // 统一补全 uploads 前缀，后端 file_path 为如 "images/xxx.webp"
  let p = filePath.startsWith('/') ? filePath : `/${filePath}`
  if (!p.startsWith('/uploads/')) {
    p = `/uploads${p}`
  }
  return `${host}${p}`
}

// 产品服务
const productService = {
  // 获取产品列表（公共端）
  getProducts: (params?: ProductQueryParams) => {
    return api.get<PaginatedProductsResponse>('/products', params)
  },

  // 获取产品详情（公共端）
  getProduct: (id: string) => {
    return api.get<Product>(`/products/${id}`)
  },

  // 管理端：创建/更新/删除
  createProduct: (params: CreateProductParams) => {
    return api.post<Product>('/products/admin', params)
  },

  updateProduct: (id: string, params: UpdateProductParams) => {
    return api.put<Product>(`/products/admin/${id}`, params)
  },

  deleteProduct: (id: string) => {
    return api.delete(`/products/admin/${id}`)
  }
}

export default productService