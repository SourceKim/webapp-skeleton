import api from './api'
import { Material } from './material'

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  pages: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

export interface Brand {
  id: string
  name: string
  description?: string
  material_id?: string
  website?: string
  status: 'ENABLED' | 'DISABLED'
  created_at?: string
  updated_at?: string
  material?: {
    id?: string
    file_path?: string
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  parent_id?: string | null
  level: number
  material_id?: string
  status: 'ENABLED' | 'DISABLED'
}

export type SpuStatus = 'DRAFT' | 'ON_SHELF' | 'OFF_SHELF'

export interface Spu {
  id: string
  name: string
  sub_title?: string
  description?: string
  category_id?: string
  brand_id?: string
  status: SpuStatus
  main_material?: Material
  sub_materials?: Material[]
  detail_content?: string
}

export type SkuStatus = 'ON_SHELF' | 'OFF_SHELF'

export interface SkuAttributeKV {
  key_id: string
  value_id: string
  key_name?: string
  value?: string
}

export interface Sku {
  id: string
  spu_id: string
  sku_code: string
  sku_name?: string
  price: string
  original_price?: string
  cost_price?: string
  stock: number
  status: SkuStatus
  is_default: boolean
  attributes?: SkuAttributeKV[]
}

export interface PaginatedResponse<T> {
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
  if (!filePath) return ''
  return process.env.TARO_APP_UPLOAD_URL + filePath
}

/**
 * 构建支持 filters[...] 的查询字符串
 */
const buildQueryString = (params?: SpuQueryParams): string => {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.page) search.append('page', String(params.page))
  if (params.limit) search.append('limit', String(params.limit))
  if (params.sort_by) search.append('sort_by', params.sort_by)
  if (params.sort_order) search.append('sort_order', params.sort_order)
  const filters = params.filters
  if (filters && typeof filters === 'object') {
    Object.entries(filters).forEach(([field, value]) => {
      if (value === undefined || value === null || value === '') return
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([op, opVal]) => {
          if (opVal !== undefined && opVal !== null && opVal !== '') {
            search.append(`filters[${field}][${op}]`, String(opVal))
          }
        })
      } else {
        search.append(`filters[${field}]`, String(value))
      }
    })
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

const mallService = {
  // 品牌列表（需登录）
  getBrands: (params?: BrandQueryParams) => api.get<PaginatedResponse<Brand>>('/products/brands', params),
  getBrand: (id: string) => api.get<Brand>(`/products/brands/${id}`),

  // 分类列表（支持 parent_id 为 null 获取顶级分类）
  getCategories: (params?: CategoryQueryParams) => api.get<PaginatedResponse<Category>>('/products/categories', params),
  getCategory: (id: string) => api.get<Category>(`/products/categories/${id}`),

  // SPU 列表与详情
  getSpus: (params?: SpuQueryParams) => api.get<PaginatedResponse<Spu>>(`/products/spu${buildQueryString(params)}`),
  getSpuDetail: (id: string) => api.get<Spu>(`/products/spu/${id}`),

  // SKU 列表
  getSkus: (params?: SkuQueryParams) => api.get<PaginatedResponse<Sku>>(`/products/sku${buildQueryString(params)}`)
}

export default mallService


