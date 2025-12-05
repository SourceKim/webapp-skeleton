import type { CreateUpdateMaterialTagQueryDto, MaterialTag } from './material-tags.d';
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common';
import createAxios from '@/utils/request';

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 创建素材 tag
 * @returns 创建的文本素材
 */
export function createMaterialTag(data: CreateUpdateMaterialTagQueryDto, option?: RequestOption): Promise<MaterialTag> {
    return createAxios(option).post(`${BASE_URL}/materials/tags/admin`, data);
}

/**
 * 获取素材 tag 列表
 * @returns 素材 tag 列表
 */
export function getMaterialTags(option?: RequestOption): RestResponse<PaginatedResponse<MaterialTag>> {
    return createAxios(option).get(`${BASE_URL}/materials/tags/admin`);
}

/**
 * 更新素材 tag
 * @returns 更新后的素材 tag
 */
export function updateMaterialTag(id: string, data: CreateUpdateMaterialTagQueryDto, option?: RequestOption): Promise<MaterialTag> {
    return createAxios(option).put(`${BASE_URL}/materials/tags/admin/${id}`, data);
}

/**
 * 删除素材 tag
 * @returns 删除后的素材 tag
 */
export function deleteMaterialTag(id: string, option?: RequestOption): Promise<MaterialTag> {
    return createAxios(option).delete(`${BASE_URL}/materials/tags/admin/${id}`)
}