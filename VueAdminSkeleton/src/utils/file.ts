import type { DownloadParam } from '@/interface/utils.d'
import { useAuthStore } from '@/stores/auth'
/**
 * 获取文件下载url
 * @param param
 * @returns string
 */
export function getDownloadFileUrl(param: DownloadParam): string {
    if (!param) return ''
    if (!param.id && !param.object) return ''
    let fileBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL
    if (!fileBaseUrl.startsWith('http')) fileBaseUrl = import.meta.env.VITE_BASE_URL + fileBaseUrl
    const authStore = useAuthStore()
    return Object.keys(param).reduce(
      (url, key) => {
        if (!isValidKey(key, param)) return url
        if (!param[key]) return url
        return `${url}&${key}=${encodeURIComponent(param[key])}`
      },
      `${fileBaseUrl}/api/file/operation/download?${import.meta.env.VITE_SYS_TOKEN_KEY}=${authStore.token}`
    )
}

/**
 * 拼接静态上传文件访问 URL（基于 uploads 静态目录）
 * 优先使用 VITE_UPLOAD_BASE_URL，其次 VITE_FILE_BASE_URL，默认 http://localhost:3000/uploads/
 */
export function getUploadFileUrl(filePath?: string | null): string | null {
  if (!filePath) return null
  const base = (import.meta.env.VITE_UPLOAD_BASE_URL || import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/') as string
  const prefix = base.replace(/\/$/, '')
  const fp = String(filePath).replace(/^\//, '')
  return `${prefix}/${fp}`
}

function isValidKey(key: string, obj: object): key is keyof typeof obj {
    return key in obj
}