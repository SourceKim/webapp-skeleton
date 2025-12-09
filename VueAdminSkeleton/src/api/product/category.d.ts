import type { Material } from '../material/material.d'

export interface ProductCategory {
  id: string
  name: string
  description?: string
  parent_id?: string
  level: number
  material_id?: string
  material?: Material
  brand_id?: string
  brand_name?: string
  status: string // 后端返回中文：启用、禁用
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CreateProductCategoryDto {
  name: string
  description?: string
  parent_id?: string
  material_id?: string
  brand_id?: string
  status?: 'ENABLED' | 'DISABLED'
}

export interface UpdateProductCategoryDto {
  name?: string
  description?: string
  parent_id?: string | null
  material_id?: string | null
  brand_id?: string | null
  status?: 'ENABLED' | 'DISABLED'
}
