export interface ProductBrand {
  id: string
  name: string
  description?: string
  material_id?: string
  website?: string
  status: 'ENABLED' | 'DISABLED'
  logo_url?: string
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


