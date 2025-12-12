import api from './api'
import { Material } from './material'
import { getUploadUrl as getEnvUploadUrl } from '../utils/env'
import type { PaginatedResponse } from '@skeleton/shared-types'

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

// 重新导出 PaginatedResponse 类型
export type { PaginatedResponse }

export const getUploadUrl = (filePath?: string): string => {
  try {
    return getEnvUploadUrl(filePath)
  } catch (error) {
    console.error('获取上传文件 URL 失败:', error)
    return ''
  }
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

