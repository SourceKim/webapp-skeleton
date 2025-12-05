import createAxios from '@/utils/request'
import type { RequestOption, RestResponse, PaginatedResponse } from './types/common'

const BASE_URL = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 上传文件
 * @param file 要上传的文件
 * @param option 请求选项
 * @returns 上传结果，包含文件信息
 */
export function uploadFile(file: File, option?: RequestOption): Promise<RestResponse<any>> {
  const formData = new FormData()
  formData.append('file', file)
  return createAxios(option).post(`${BASE_URL}/file/operation/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 查询文件列表
 * @param params 查询参数
 * @param option 请求选项
 * @returns 文件列表（分页）
 */
export function queryFileList(params?: any, option?: RequestOption): Promise<RestResponse<PaginatedResponse<any>>> {
  return createAxios(option).get(`${BASE_URL}/file/operation/list`, { params })
}