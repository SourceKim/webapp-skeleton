export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  category_id?: string
  materials?: { id: string; filename?: string; file_path?: string; type?: string }[]
  created_at?: string
  updated_at?: string
}

export interface CreateProductDto {
  name: string
  description?: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  category_id?: string
  material_ids?: string[]
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  stock?: number
  status?: 'active' | 'inactive'
  category_id?: string
  material_ids?: string[]
}


