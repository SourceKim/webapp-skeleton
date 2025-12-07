import type { DownloadParam } from '@/interface/utils.d'
import { useAuthStore } from '@/stores/auth'
import { ENV } from './env'

/**
 * 获取文件下载url
 * @param param 下载参数
 * @returns 完整的下载 URL
 */
export function getDownloadFileUrl(param: DownloadParam): string {
    if (!param) return ''
    if (!param.id && !param.object) return ''
    
    const authStore = useAuthStore()
    
    // 构建基础 URL，确保路径格式正确（避免双斜杠）
    const basePath = `${ENV.BASE_URL}${ENV.SYSTEM_BASE_URL}/file/operation/download`.replace(/([^:]\/)\/+/g, '$1')
    
    // 构建查询参数
    const queryParams = Object.keys(param).reduce(
      (params, key) => {
        if (!isValidKey(key, param)) return params
        if (!param[key]) return params
        params.push(`${key}=${encodeURIComponent(param[key])}`)
        return params
      },
      [`${ENV.SYS_TOKEN_KEY}=${authStore.token}`]
    )
    
    return `${basePath}?${queryParams.join('&')}`
}

/**
 * 拼接静态上传文件访问 URL（基于 uploads 静态目录）
 * 使用环境变量 VITE_BASE_URL + VITE_SYSTEM_UPLOAD_PATH 配置
 * @param filePath 文件路径（相对路径）
 * @returns 完整的文件访问 URL
 */
export function getUploadFileUrl(filePath?: string | null): string | null {
  if (!filePath) return null
  
  const prefix = (ENV.BASE_URL + ENV.UPLOAD_BASE_URL).replace(/\/$/, '')
  const fp = String(filePath).replace(/^\//, '')
  return `${prefix}/${fp}`
}

function isValidKey(key: string, obj: object): key is keyof typeof obj {
    return key in obj
}