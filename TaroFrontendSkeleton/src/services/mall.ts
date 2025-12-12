import api from './api'
import { Material } from './material'
import { getUploadUrl as getEnvUploadUrl } from '../utils/env'
import type {
  PaginatedResponse,
  ProductSpu,
  ProductSku,
  ProductCategory,
  ProductBrand,
  ProductSpuStatus,
  ProductSkuStatus,
  ProductCategoryStatus,
  ProductBrandStatus,
  SkuAttributeKV
} from '@skeleton/shared-types'

// 重新导出类型和枚举
export type { ProductSpu, ProductSku, ProductCategory, ProductBrand, SkuAttributeKV }
export { ProductSpuStatus, ProductSkuStatus, ProductCategoryStatus, ProductBrandStatus }

// 类型别名，保持向后兼容
export type Spu = ProductSpu
export type Sku = ProductSku
export type SpuStatus = ProductSpuStatus
export type SkuStatus = ProductSkuStatus

// PaginatedMeta 保持本地定义（与后端响应结构匹配）
export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  pages: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

// 类型别名，保持向后兼容
export type Brand = ProductBrand
export type Category = ProductCategory

// 扩展 PaginatedResponse，使用本地的 meta 结构
export interface PaginatedResponse<T> extends Omit<import('@skeleton/shared-types').PaginatedResponse<T>, 'meta'> {
  items: T[]
  meta: PaginatedMeta
}

export interface BrandQueryParams {
  page?: number
  limit?: number
  status?: 'ENABLED' | 'DISABLED'
}

export interface CategoryQueryParams {
  page?: number
  limit?: number
  parent_id?: string | null
  level?: number
  status?: 'ENABLED' | 'DISABLED'
  filters?: FilterParams
}

export interface FilterParams { [key: string]: any }

export interface SpuQueryParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  filters?: FilterParams
}

export interface SkuQueryParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  filters?: FilterParams
}

export const getUploadUrl = (filePath?: string): string => {
  try {
    return getEnvUploadUrl(filePath)
  } catch (error) {
    console.error('获取上传文件 URL 失败:', error)
    return ''
  }
}

/**
 * 构建支持 filters[...] 的查询字符串
 */
const buildQueryString = (params?: any): string => {
  if (!params) return ''
  const search = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    
    if (key === 'filters' && typeof value === 'object') {
      Object.entries(value).forEach(([field, val]) => {
        if (val === undefined || val === null || val === '') return
        if (typeof val === 'object' && !Array.isArray(val)) {
          Object.entries(val).forEach(([op, opVal]) => {
            if (opVal !== undefined && opVal !== null && opVal !== '') {
              search.append(`filters[${field}][${op}]`, String(opVal))
            }
          })
        } else {
          search.append(`filters[${field}]`, String(val))
        }
      })
    } else {
      search.append(key, String(value))
    }
  })

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

const mallService = {
  // 品牌列表（需登录）
  getBrands: (params?: BrandQueryParams) => api.get<PaginatedResponse<Brand>>('/products/brands', params),
  getBrand: (id: string) => api.get<Brand>(`/products/brands/${id}`),

  // 分类列表（支持 parent_id 为 null 获取顶级分类）
  getCategories: (params?: CategoryQueryParams) => api.get<PaginatedResponse<Category>>(`/products/categories${buildQueryString(params)}`),
  getCategory: (id: string) => api.get<Category>(`/products/categories/${id}`),

  // SPU 列表与详情
  getSpus: (params?: SpuQueryParams) => api.get<PaginatedResponse<Spu>>(`/products/spu${buildQueryString(params)}`),
  getSpuDetail: (id: string) => api.get<Spu>(`/products/spu/${id}`),

  // SKU 列表
  getSkus: (params?: SkuQueryParams) => api.get<PaginatedResponse<Sku>>(`/products/sku${buildQueryString(params)}`)
}

export default mallService


