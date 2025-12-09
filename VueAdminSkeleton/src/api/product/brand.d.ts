export interface ProductBrand {
  id: string
  name: string
  description?: string
  material_id?: string
  website?: string
  status: string // 后端返回中文：启用、禁用
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CreateProductBrandDto {
  name: string
  description?: string
  material_id?: string
  website?: string
  status?: 'ENABLED' | 'DISABLED'
}

export interface UpdateProductBrandDto {
  name?: string
  description?: string
  material_id?: string
  website?: string
  status?: 'ENABLED' | 'DISABLED'
}


