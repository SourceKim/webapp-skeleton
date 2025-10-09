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

function isValidKey(key: string, obj: object): key is keyof typeof obj {
    return key in obj
}