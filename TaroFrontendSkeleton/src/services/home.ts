import api from './api'
import { Material } from './material'

export interface Carousel {
  id: string
  title?: string
  material_id: string
  material?: Material
  spu_id?: string
  sort_order: number
  is_active: boolean
}

export interface ShopIntroBanner {
  id: string
  shop_intro_id: string
  material_id: string
  material?: Material
  sort_order: number
}

export interface ShopIntro {
  id: string
  name: string
  introduction?: string
  detail?: string
  contact_phone?: string
  longitude?: string
  latitude?: string
  address?: string
  banners?: ShopIntroBanner[]
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: any
}

export const getUploadUrl = (filePath?: string): string => {
  if (!filePath) return ''
  // 假设环境变量与 mall.ts 中一致
  const baseUrl = process.env.TARO_APP_UPLOAD_URL || 'http://localhost:3000/uploads/'
  return baseUrl + filePath
}

const homeService = {
  // 获取首页轮播图
  getCarousels: (params?: { is_active?: boolean, page?: number, limit?: number }) => 
    api.get<PaginatedResponse<Carousel>>('/mall/carousels', params),
    
  // 获取店铺介绍
  getShopIntro: () => 
    api.get<ShopIntro>('/mall/shop-intro')
}

export default homeService

