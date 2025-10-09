import type { CreateAndUpdatePermissionQueryDto, Permission } from './permission.d';
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common';
import createAxios from '@/utils/request';

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 创建权限
 * @returns 创建的权限
 */
export function createPermission(data: CreateAndUpdatePermissionQueryDto, option?: RequestOption): Promise<RestResponse<Permission>> {
    return createAxios(option).post(`${BASE_URL}/permissions/admin`, data);
}

/**
 * 获取所有权限
 * @returns 权限列表
 */
export function getPermissions(option?: RequestOption): Promise<RestResponse<PaginatedResponse<Permission>>> {
    return createAxios(option).get(`${BASE_URL}/permissions/admin`);
}

/**
 * 获取指定权限
 * @param id 权限ID
 * @param option 请求选项
 * @returns 权限详情
 */
export function getPermission(id: string, option?: RequestOption): Promise<RestResponse<Permission>> {
    return createAxios(option).get(`${BASE_URL}/permissions/admin/${id}`);
}

/**
 * 更新指定权限
 * @returns 更新后的权限
 */
export function updatePermission(id: string, data: CreateAndUpdatePermissionQueryDto, option?: RequestOption): Promise<RestResponse<Permission>> {
    return createAxios(option).put(`${BASE_URL}/permissions/admin/${id}`, data);
}

/**
 * 删除指定权限
 * @returns 删除后的权限
 */
export function deletePermission(id: string, option?: RequestOption): Promise<RestResponse<Permission>> {
    return createAxios(option).delete(`${BASE_URL}/permissions/admin/${id}`)
}