export interface ProductSku {
  id: string
  spu_id: string
  sku_code: string
  sku_name?: string
  price: string
  original_price?: string | null
  cost_price?: string | null
  stock: number
  status: string // 后端返回中文：上架、下架
  is_default: boolean
  attributes?: Array<{ key_id: string; value_id: string; key_name?: string; value?: string }>
  created_at?: string | Date
  updated_at?: string | Date
}

export interface CreateProductSkuDto {
  spu_id: string
  sku_code: string
  sku_name?: string
  price: string
  original_price?: string
  cost_price?: string
  stock: number
  status?: 'ON_SHELF' | 'OFF_SHELF'
  is_default?: boolean
}

export interface UpdateProductSkuDto {
  sku_code?: string
  sku_name?: string
  price?: string
  original_price?: string | null
  cost_price?: string | null
  stock?: number
  status?: 'ON_SHELF' | 'OFF_SHELF'
  is_default?: boolean
}


