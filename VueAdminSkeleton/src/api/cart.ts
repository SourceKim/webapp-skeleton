import createAxios from '@/utils/request'
import type { Cart as ICart } from '@skeleton/shared-types'

const request = createAxios({})

/**
 * 购物车类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { Cart } from '@skeleton/shared-types'

// 扩展 Cart 接口，添加前端特定字段
export interface CartItemDTO extends ICart {
  user?: { id: string; username: string; email?: string; phone?: string; avatar?: string }
  sku?: { 
    id: string
    sku_code?: string
    sku_name?: string
    price?: number
    spu?: { name: string; main_material?: { file_path: string } }
    sku_attributes?: Array<{ attribute_key: { name: string }; attribute_value: { value: string } }>
  }
  created_at?: string
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface PaginatedCartsResponse {
  items: CartItemDTO[]
  meta: PaginatedMeta
}

export interface CartsQuery {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  filters?: Record<string, any>
}

export const listAdminCarts = (params: CartsQuery) =>
  (request as any).get(`/admin/carts`, { params })


