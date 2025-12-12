import api from './api'
import { Material } from './material'
import { getUploadUrl as getEnvUploadUrl } from '../utils/env'
import type { PaginatedResponse, Carousel, ShopIntro, ShopIntroBanner } from '@skeleton/shared-types'

// 重新导出类型
export type { Carousel, ShopIntro, ShopIntroBanner }

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

