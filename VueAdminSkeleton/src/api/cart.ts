import createAxios from '@/utils/request'

const apiBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL || '/api/v1'
const request = createAxios({})

export interface CartItemDTO {
  id: string
  user_id?: string
  quantity: number
  selected: boolean
  sku?: { id: string; sku_code?: string; sku_name?: string; price?: number }
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
  request.get<PaginatedCartsResponse>(`${apiBaseUrl}/admin/carts`, { params })


