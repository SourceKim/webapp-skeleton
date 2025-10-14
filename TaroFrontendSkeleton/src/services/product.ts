import api from './api'

// 产品接口
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  category: string
  status: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
  updated_at: string
}

// 创建产品请求参数
export interface CreateProductParams {
  name: string
  description: string
  price: number
  stock: number
  image: string
  category: string
  status?: 'active' | 'inactive'
}

// 更新产品请求参数
export interface UpdateProductParams {
  name?: string
  description?: string
  price?: number
  stock?: number
  image?: string
  category?: string
  status?: 'active' | 'inactive'
}

// 产品查询参数
export interface ProductQueryParams {
  page?: number
  limit?: number
  category?: string
}

// 产品列表响应
export interface ProductListResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 产品服务
const productService = {
  // 获取产品列表
  getProducts: (params?: ProductQueryParams) => {
    return api.get<ProductListResponse>('/products', params)
  },

  // 获取产品详情
  getProduct: (id: string) => {
    return api.get<Product>(`/products/${id}`)
  },

  // 获取产品分类
  getCategories: () => {
    return api.get<string[]>('/products/categories')
  },

  // 创建产品（管理员）
  createProduct: (params: CreateProductParams) => {
    return api.post<Product>('/products/admin', params)
  },

  // 更新产品（管理员）
  updateProduct: (id: string, params: UpdateProductParams) => {
    return api.put<Product>(`/products/admin/${id}`, params)
  },

  // 删除产品（管理员）
  deleteProduct: (id: string) => {
    return api.delete(`/products/admin/${id}`)
  }
}

export default productService 