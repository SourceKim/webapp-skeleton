import createAxios from '@/utils/request';
import type {
  CreateMaterialDto,
  UpdateMaterialDto,
  BatchDeleteMaterialsDto
} from './material.d';
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common';
import type { Material } from './material.d';

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 获取素材列表
 * @param params 查询参数
 * @returns 素材列表（分页）
 */
export function getMaterials(option?: RequestOption): RestResponse<PaginatedResponse<Material>> {
  return createAxios(option).get(`${BASE_URL}/materials/admin`);
}

/**
 * 获取素材详情
 * @param id 素材ID
 * @returns 素材详情
 */
export function getMaterialById(id: string, option?: RequestOption): RestResponse<Material> {
  return createAxios(option).get(`${BASE_URL}/materials/admin/${id}`);
}

/**
 * 上传素材
 * @param formData 包含文件和素材信息的FormData对象
 * @returns 上传的素材
 */
export function uploadMaterial(formData: FormData, option?: RequestOption) {
  return createAxios(option).post(`${BASE_URL}/materials/admin/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 更新素材
 * @param id 素材ID
 * @param data 更新信息
 * @returns 更新后的素材
 */
export function updateMaterial(id: string, data: UpdateMaterialDto, option?: RequestOption) {
  return createAxios(option).put(`${BASE_URL}/materials/admin/${id}`, data);
}

/**
 * 删除素材
 * @param id 素材ID
 * @returns 删除结果
 */
export function deleteMaterial(id: string, option?: RequestOption) {
  return createAxios(option).delete(`${BASE_URL}/materials/admin/${id}`);
}

/**
 * 批量删除素材
 * @param data 要删除的素材ID列表
 * @returns 删除结果
 */
export function batchDeleteMaterials(data: BatchDeleteMaterialsDto, option?: RequestOption) {
  return createAxios(option).post(`${BASE_URL}/materials/admin/batch/delete`, data);
}
