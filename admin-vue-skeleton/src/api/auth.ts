import createAxios from '@/utils/request';
import type { RequestOption, RestResponse } from '@/api/types/common';
import type { RegisterDto, RegisterResponseDto, LoginDto, LoginResponseDto } from '@/api/types/user';

const apiBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL || '/api/v1';

/**
 * 用户注册
 * @param data 注册信息
 * @param option 请求选项
 * @returns 注册结果
 */
export function register(data: RegisterDto, option?: RequestOption): RestResponse<RegisterResponseDto> {
  return createAxios(option).post(`${apiBaseUrl}/auth/register`, data);
}

/**
 * 用户登录
 * @param data 登录信息
 * @param option 请求选项
 * @returns 登录结果
 */
export function login(data: LoginDto, option?: RequestOption): RestResponse<LoginResponseDto> {
  return createAxios(option).post(`${apiBaseUrl}/auth/login`, data);
}

/**
 * 使用 token 进行用户登录
 * @param option 请求选项
 * @returns 登录结果
 */
export function tokenLogin(option?: RequestOption): RestResponse<LoginResponseDto> {
    return createAxios(option).post(`${apiBaseUrl}/auth/token-login`);
}

/**
 * 退出登录
 * @param option 请求选项
 * @returns 退出结果
 */
export function logout(option?: RequestOption): RestResponse<void> {
    return createAxios(option).post(`${apiBaseUrl}/auth/logout`);
}