import type { CreateAndUpdateRoleQueryDto, Role } from './role.d';
import type { Permission } from './permission.d';
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common';
import createAxios from '@/utils/request';

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 创建角色
 * @returns 创建的角色
 */
export function createRole(data: CreateAndUpdateRoleQueryDto, option?: RequestOption): Promise<RestResponse<Role>> {
    return createAxios(option).post(`${BASE_URL}/roles/admin`, data);
}

/**
 * 获取角色列表（获取所有角色）
 * @returns 角色列表
 */
export function getRoles(option?: RequestOption): RestResponse<PaginatedResponse<Role>> {
    return createAxios(option).get(`${BASE_URL}/roles/admin`);
}

/**
 * 获取指定角色详情（包含权限信息）
 * @param roleId 角色ID
 * @param option 请求选项
 * @returns 角色详情（包含权限）
 */
export function getRoleDetail(roleId: string, option?: RequestOption): Promise<RestResponse<Role & { permissions: Permission[] }>> {
    return createAxios(option).get(`${BASE_URL}/roles/admin/${roleId}`);
}

/**
 * 更新指定角色
 * @returns 更新后的角色
 */
export function updateRole(id: string, data: CreateAndUpdateRoleQueryDto, option?: RequestOption): Promise<RestResponse<Role>> {
    return createAxios(option).put(`${BASE_URL}/roles/admin/${id}`, data);
}

/**
 * 删除指定角色
 * @returns 删除后的角色
 */
export function deleteRole(id: string, option?: RequestOption): Promise<RestResponse<Role>> {
    return createAxios(option).delete(`${BASE_URL}/roles/admin/${id}`)
}

/**
 * 为角色分配权限
 * @param roleId 角色ID
 * @param permissionIds 权限ID列表
 * @param option 请求选项
 * @returns 分配结果
 */
export function assignPermissionsToRole(
    roleId: string, 
    permissionIds: string[], 
    option?: RequestOption
): Promise<RestResponse<{ roleId: string; permissionIds: string[] }>> {
    return createAxios(option).post(`${BASE_URL}/roles/admin/${roleId}/permissions`, {
        permissionIds
    });
}

/**
 * 为用户分配角色
 * @param userId 用户ID
 * @param roleIds 角色ID列表
 * @param option 请求选项
 * @returns 分配结果
 */
export function assignRolesToUser(
    userId: string, 
    roleIds: string[], 
    option?: RequestOption
): Promise<RestResponse<{ userId: string; roleIds: string[] }>> {
    return createAxios(option).post(`${BASE_URL}/users/admin/${userId}/roles`, {
        roleIds
    });
}

/**
 * 移除角色的权限
 * @param roleId 角色ID
 * @param permissionIds 权限ID列表
 * @param option 请求选项
 * @returns 移除结果
 */
export function removePermissionsFromRole(
    roleId: string, 
    permissionIds: string[], 
    option?: RequestOption
): Promise<RestResponse<{ roleId: string; permissionIds: string[] }>> {
    return createAxios(option).delete(`${BASE_URL}/roles/admin/${roleId}/permissions`, {
        data: { permissionIds }
    });
}