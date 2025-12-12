import createAxios from '@/utils/request'
import type { RequestOption, RestResponse } from '@/api/types/common'

// --- Carousel API ---

import type { Carousel as ICarousel } from '@skeleton/shared-types'

/**
 * 轮播图类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { Carousel } from '@skeleton/shared-types'

// 扩展 Carousel 接口，添加前端特定字段
export interface CarouselDTO extends ICarousel {
    id: string
    title?: string
    material_id: string
    material?: any // Replace with actual MaterialDTO type if available
    spu_id?: string
    spu?: any // Replace with ProductSpuDTO
    sort_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateCarouselDto {
    title?: string
    material_id: string
    spu_id?: string
    sort_order?: number
    is_active?: boolean
}

export interface UpdateCarouselDto {
    title?: string
    material_id?: string
    spu_id?: string
    sort_order?: number
    is_active?: boolean
}

export const getCarousels = (params?: any, option?: RequestOption): RestResponse<any> => {
    return createAxios(option).get(`/mall/carousels`, { params })
}

export const getCarousel = (id: string, option?: RequestOption): RestResponse<CarouselDTO> => {
    return createAxios(option).get(`/mall/carousels/${id}`)
}

export const createCarousel = (data: CreateCarouselDto, option?: RequestOption): RestResponse<CarouselDTO> => {
    return createAxios(option).post(`/mall/admin/carousels`, data)
}

export const updateCarousel = (id: string, data: UpdateCarouselDto, option?: RequestOption): RestResponse<CarouselDTO> => {
    return createAxios(option).put(`/mall/admin/carousels/${id}`, data)
}

export const deleteCarousel = (id: string, option?: RequestOption): RestResponse<void> => {
    return createAxios(option).delete(`/mall/admin/carousels/${id}`)
}

// --- ShopIntro API ---
import type { ShopIntro as IShopIntro, ShopIntroBanner as IShopIntroBanner } from '@skeleton/shared-types'

/**
 * 店铺介绍横幅类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ShopIntroBanner } from '@skeleton/shared-types'

// 扩展 ShopIntroBanner 接口
export interface ShopIntroBannerDTO extends IShopIntroBanner {
    material?: any
}

/**
 * 店铺介绍类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ShopIntro } from '@skeleton/shared-types'

// 扩展 ShopIntro 接口
export interface ShopIntroDTO extends IShopIntro {
    banners?: ShopIntroBannerDTO[]
}

export interface UpdateShopIntroDto {
    name?: string
    introduction?: string
    detail?: string
    contact_phone?: string
    longitude?: number
    latitude?: number
    address?: string
    banner_ids?: string[]
}

export const getShopIntro = (option?: RequestOption): RestResponse<ShopIntroDTO> => {
    return createAxios(option).get(`/mall/shop-intro`)
}

export const updateShopIntro = (data: UpdateShopIntroDto, option?: RequestOption): RestResponse<ShopIntroDTO> => {
    return createAxios(option).put(`/mall/admin/shop-intro`, data)
}

// --- Helper for SPU Selection ---
export const getSpuList = (params?: any, option?: RequestOption): RestResponse<any> => {
    return createAxios(option).get(`/products/spu`, { params })
}
