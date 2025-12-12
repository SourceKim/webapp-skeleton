import createAxios from '@/utils/request'
import type { RequestOption, RestResponse, PaginatedResponse } from './types/common'
import type { Material } from './material/material.d'

/**
 * 上传文件
 * @param file 要上传的文件
 * @param option 请求选项
 * @returns 上传结果，包含文件信息
 */
export function uploadFile(file: File, option?: RequestOption): Promise<RestResponse<any>> {
  const formData = new FormData()
  formData.append('file', file)
  return createAxios(option).post(`/file/operation/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 将 Material 数据转换为 selectSysFile 组件期望的格式
 */
function transformMaterialToFileItem(material: Material): Record<string, unknown> {
  // 从 file_path 提取后缀
  const suffix = material.file_path?.split('.').pop()?.toLowerCase() || ''
  
  return {
    id: material.id,
    name: material.filename || material.original_name,
    object: material.file_path, // file_path 作为 object
    contentType: material.mime_type,
    suffix: suffix,
    size: Number(material.file_size) || 0,
    sha1: material.file_hash,
    createTime: material.created_at,
    // Material 特有字段
    imgWidth: (material.metadata as any)?.width,
    imgHeight: (material.metadata as any)?.height,
    imgRatio: (material.metadata as any)?.ratio,
    status: material.is_public ? 1 : 2 // 1=正常, 2=已锁定（假设）
  }
}

/**
 * 查询文件列表（使用 materials API）
 * @param params 查询参数，支持 type 参数（如 'image/'）来过滤文件类型
 * @param option 请求选项
 * @returns 文件列表（分页），返回的数据会被转换为兼容格式
 */
export function queryFileList(params?: Record<string, unknown>, option?: RequestOption): Promise<RestResponse<PaginatedResponse<any>>> {
  // 构建查询参数
  const queryParams: Record<string, unknown> = {}
  
  // 处理 type 参数：如果 type 是 'image/'，转换为 type='image' 查询参数
  if (params?.type) {
    const typeStr = String(params.type)
    if (typeStr.startsWith('image/')) {
      queryParams.type = 'image'
    }
  }
  
  // 传递其他参数（如分页参数）
  if (params) {
    Object.keys(params).forEach(key => {
      if (key !== 'type') {
        queryParams[key] = params[key]
      }
    })
  }
  
  return createAxios(option).get(`/materials/admin`, { params: queryParams }).then((response) => {
    // 转换数据格式
    if (response.data?.items) {
      response.data.items = response.data.items.map((item: Material) => transformMaterialToFileItem(item))
    }
    return response
  })
}