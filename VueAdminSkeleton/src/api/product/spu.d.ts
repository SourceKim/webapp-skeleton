import type { Material } from '../material/material.d'

export interface ProductSpu {
  id: string
  name: string
  sub_title?: string
  description?: string
  category_id?: string
  category?: { name: string }
  brand_id?: string
  brand?: { name: string }
  status: string // 后端返回中文：草稿、上架、下架
  main_material_id?: string
  main_material?: Material
  sub_materials?: Material[]
  detail_content?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CreateProductSpuDto {
  name: string
  sub_title?: string
  description?: string
  category_id?: string
  brand_id?: string
  status?: 'DRAFT' | 'ON_SHELF' | 'OFF_SHELF'
  main_material_id?: string
  sub_material_ids?: string[]
  detail_content?: string
}

export interface UpdateProductSpuDto {
  name?: string
  sub_title?: string
  description?: string
  category_id?: string | null
  brand_id?: string | null
  status?: 'DRAFT' | 'ON_SHELF' | 'OFF_SHELF'
  main_material_id?: string | null
  sub_material_ids?: string[] | null
  detail_content?: string | null
}


