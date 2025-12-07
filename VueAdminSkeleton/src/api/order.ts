import createAxios from '@/utils/request'
import type { Order, OrderQuery } from './product/order.d'
import type { RestResponse, PaginatedResponse } from './types/common'
const request = createAxios({})

export function listAdminOrders(params: OrderQuery): RestResponse<PaginatedResponse<Order>> {
  return request.get(`/admin/orders`, { params })
}

export function getAdminOrderById(id: string): RestResponse<Order> {
  return request.get(`/admin/orders/${id}`)
}

export function shipOrder(id: string): RestResponse<Order> {
  return request.put(`/admin/orders/${id}/delivery`)
}

export function updateOrderStatus(id: string, status: string): RestResponse<Order> {
  return request.put(`/admin/orders/${id}/status`, { status })
}
