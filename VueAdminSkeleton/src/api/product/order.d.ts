export interface OrderItem {
  id: string
  sku_id: string
  sku_snapshot: any
  quantity: number
  unit_price: string
  total_price: string
}

export interface Order {
  id: string
  user: { id: string; username: string; phone?: string; email?: string; avatar?: string }
  total_amount: string
  payable_amount: string
  discount_amount: string
  shipping_amount: string
  order_status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED'
  payment_status: 'UNPAID' | 'PAID' | 'REFUNDED'
  delivery_status: 'PENDING' | 'SHIPPED' | 'DELIVERED'
  payment_method?: 'ALIPAY' | 'WECHAT' | 'CASH'
  address_snapshot: any
  remark?: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderQuery {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  filters?: {
    id?: string
    user_id?: string
    order_status?: string
    payment_status?: string
    delivery_status?: string
  }
}


