import api from './api'

// 订单商品接口
export interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

// 订单地址接口
export interface OrderAddress {
  name: string
  phone: string
  address: string
}

// 订单接口
export interface Order {
  id: string
  orderNo: string
  userId: string
  products: OrderProduct[]
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  address: OrderAddress
  created_at: string
  updated_at: string
}

// 创建订单请求参数
export interface CreateOrderParams {
  address: OrderAddress
}

// 更新订单状态请求参数
export interface UpdateOrderStatusParams {
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
}

// 订单服务
const orderService = {
  // 获取订单列表
  getOrders: () => {
    return api.get<Order[]>('/orders')
  },

  // 获取订单详情
  getOrder: (id: string) => {
    return api.get<Order>(`/orders/${id}`)
  },

  // 创建订单
  createOrder: (params: CreateOrderParams) => {
    return api.post<Order>('/orders', params)
  },

  // 更新订单状态
  updateOrderStatus: (id: string, params: UpdateOrderStatusParams) => {
    return api.put<Order>(`/orders/${id}/status`, params)
  }
}

export default orderService 