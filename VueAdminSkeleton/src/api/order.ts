import createAxios from '@/utils/request'

const apiBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL || '/api/v1'
const request = createAxios({})

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'canceled'

export interface OrderItemRef {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  unit_price: number
  product?: { id: string; name: string; price: number } | null
}

export interface OrderDTO {
  id: string
  user_id: string
  status: OrderStatus
  total_price: number
  address?: string
  shipping_no?: string
  remark?: string
  items?: OrderItemRef[]
  paid_at?: string | null
  shipped_at?: string | null
  completed_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  pages: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

export interface PaginatedOrdersResponse {
  items: OrderDTO[]
  meta: PaginatedMeta
}

export interface OrdersQuery {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  filters?: Record<string, any>
}

export const listAdminOrders = (params: OrdersQuery) =>
  request.get<PaginatedOrdersResponse>(`${apiBaseUrl}/admin/orders`, { params })

export const shipOrder = (id: string, shipping_no: string) =>
  request.post<OrderDTO>(`${apiBaseUrl}/admin/orders/${id}/ship`, { shipping_no })


