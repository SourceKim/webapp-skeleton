import type { CreateUpdateMaterialCategoryQueryDto, MaterialCategory } from './material-category.d';
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common';
import createAxios from '@/utils/request';

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 创建素材分类
 * @returns 创建的素材分类
 */
export function createMaterialCategory(data: CreateUpdateMaterialCategoryQueryDto, option?: RequestOption): Promise<MaterialCategory> {
    return createAxios(option).post(`${BASE_URL}/materials/categories/admin`, data);
}

/**
 * 获取素材分类列表
 * @returns 素材分类列表
 */
export function getMaterialCategories(option?: RequestOption): RestResponse<PaginatedResponse<MaterialCategory>> {
    return createAxios(option).get(`${BASE_URL}/materials/categories/admin`);
}

/**
 * 更新素材分类
 * @returns 更新后的素材分类
 */
export function updateMaterialCategory(id: string, data: CreateUpdateMaterialCategoryQueryDto, option?: RequestOption): Promise<MaterialCategory> {
    return createAxios(option).put(`${BASE_URL}/materials/categories/admin/${id}`, data);
}

/**
 * 删除素材分类
 * @returns 删除后的素材分类
 */
export function deleteMaterialCategory(id: string, option?: RequestOption): Promise<MaterialCategory> {
    return createAxios(option).delete(`${BASE_URL}/materials/categories/admin/${id}`)
}