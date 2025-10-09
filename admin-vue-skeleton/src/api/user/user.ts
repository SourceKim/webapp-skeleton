/**
 * 用户管理相关 API
 */
import createAxios from '@/utils/request';
import type { PaginatedResponse, RequestOption, RestResponse } from '../types/common';
import type { User, CreateUserDto, AdminUpdateUserDto } from '../types/user';

const apiBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL || '/api/v1';

/**
 * 获取所有用户
 * @param params 查询参数
 * @param option 请求选项
 * @returns 用户列表
 */
export function getUserList(option?: RequestOption): RestResponse<PaginatedResponse<User>> {
  return createAxios(option).get(`${apiBaseUrl}/users/admin`);
}

/**
 * 获取指定用户
 * @param id 用户ID
 * @param option 请求选项
 * @returns 用户信息
 */
export function getUser(id: string, option?: RequestOption): RestResponse<User> {
  return createAxios(option).get(`${apiBaseUrl}/users/admin/${id}`);
}

/**
 * 创建用户
 * @param data 用户信息
 * @param option 请求选项
 * @returns 创建的用户
 */
export function createUser(data: CreateUserDto, option?: RequestOption): RestResponse<User> {
  return createAxios(option).post(`${apiBaseUrl}/users/admin`, data);
}

/**
 * 更新指定用户
 * @param id 用户ID
 * @param data 更新的用户信息
 * @param option 请求选项
 * @returns 更新后的用户
 */
export function updateUser(id: string, data: AdminUpdateUserDto, option?: RequestOption): RestResponse<User> {
  return createAxios(option).put(`${apiBaseUrl}/users/admin/${id}`, data);
}

/**
 * 删除指定用户
 * @param id 用户ID
 * @param option 请求选项
 * @returns 删除结果
 */
export function deleteUser(id: string, option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${apiBaseUrl}/users/admin/${id}`);
}

/**
 * 批量删除用户
 * @param ids 用户ID列表
 * @param option 请求选项
 * @returns 删除结果
 */
export function delUserByIds(ids: string[], option?: RequestOption): RestResponse<{ id: string }> {
  return createAxios(option).delete(`${apiBaseUrl}/users/admin/batch`, { data: { ids } });
}

/**
 * 为用户分配角色
 * @param userId 用户ID
 * @param roleIds 角色ID列表
 * @param option 请求选项
 * @returns 分配结果
 */
export function assignRolesToUser(userId: string, roleIds: string[], option?: RequestOption): RestResponse<{ userId: string; roleIds: string[] }> {
  return createAxios(option).post(`${apiBaseUrl}/users/admin/${userId}/roles`, { roleIds });
}

/**
 * 获取当前用户信息
 * @param option 请求选项
 * @returns 用户信息
 */
export function getCurrentUser(option?: RequestOption): RestResponse<User> {
  return createAxios(option).get(`${apiBaseUrl}/users/profile`);
}

/**
 * 更新当前用户信息
 * @param data 更新的用户信息
 * @param option 请求选项
 * @returns 更新后的用户信息
 */
export function updateCurrentUser(data: AdminUpdateUserDto, option?: RequestOption): RestResponse<User> {
  return createAxios(option).put(`${apiBaseUrl}/users/profile`, data);
} 