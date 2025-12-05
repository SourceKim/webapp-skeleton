import createAxios from '@/utils/request'
import type { Order, OrderQuery } from './product/order.d'
import type { RestResponse, PaginatedResponse } from './types/common'

const apiBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL || '/api/v1'
const request = createAxios({})

export function listAdminOrders(params: OrderQuery): RestResponse<PaginatedResponse<Order>> {
  return request.get(`${apiBaseUrl}/admin/orders`, { params })
}

export function getAdminOrderById(id: string): RestResponse<Order> {
  return request.get(`${apiBaseUrl}/admin/orders/${id}`)
}

export function shipOrder(id: string): RestResponse<Order> {
  return request.put(`${apiBaseUrl}/admin/orders/${id}/delivery`)
}

export function updateOrderStatus(id: string, status: string): RestResponse<Order> {
  return request.put(`${apiBaseUrl}/admin/orders/${id}/status`, { status })
}
