/**
 * 环境变量配置工具
 * 参考 VueAdminSkeleton/src/utils/env.ts
 * 
 * 所有环境变量都从此工具读取，如果未设置必需的环境变量则报错
 * 
 * 注意：Taro 中只有以 TARO_APP_ 开头的变量会通过 webpack.DefinePlugin 静态嵌入到客户端代码中
 */

/**
 * 获取环境变量对象（兼容浏览器和 Node.js 环境）
 */
function getProcessEnv(): Record<string, string | undefined> {
  // 浏览器环境：使用全局 process.env（由 Vite define 注入）或空对象
  if (typeof process !== 'undefined' && process.env) {
    return process.env
  }
  // 如果 process 不存在，返回空对象（会在构建时被 Vite define 替换）
  return (typeof process !== 'undefined' ? (process as any).env : {}) as Record<string, string | undefined>
}

/**
 * 获取环境变量，如果未赋值则直接报错
 * @param key 环境变量键名
 * @param description 环境变量的描述信息（用于错误提示）
 * @param defaultValue 默认值（如果提供了默认值，则不会报错）
 * @returns 环境变量的值
 * @throws Error 如果环境变量未设置且没有默认值
 */
export function getEnv(key: string, description?: string, defaultValue?: string): string {
  const env = getProcessEnv()
  const value = env[key]
  
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    
    const desc = description ? ` (${description})` : ''
    throw new Error(
      `缺少必需的环境变量: ${key}${desc}\n` +
      `请在 .env 文件中配置此环境变量`
    )
  }
  
  return value
}

/**
 * 获取环境变量（可选），如果未赋值则返回 undefined
 * @param key 环境变量键名
 * @returns 环境变量的值或 undefined
 */
export function getEnvOptional(key: string): string | undefined {
  const env = getProcessEnv()
  const value = env[key]
  return value === '' ? undefined : value
}

/**
 * 环境变量配置对象
 * 所有环境变量都从此对象读取
 * 
 * 注意：Taro 中只有以 TARO_APP_ 开头的变量会通过 webpack.DefinePlugin 静态嵌入到客户端代码中
 */
export const ENV = {
  // 基础配置
  BASE_URL: getEnv('TARO_APP_BASE_URL', '基础 URL（完整地址，包含协议和端口），如 http://localhost:3000。为空时使用相对路径，避免跨域问题', ''),
  SYSTEM_API_PATH: getEnv('TARO_APP_SYSTEM_API_PATH', 'API 基础路径（相对路径），如 /api/v1', '/api/v1'),
  SYSTEM_UPLOAD_PATH: getEnv('TARO_APP_SYSTEM_UPLOAD_PATH', '上传文件访问路径（相对路径），如 /uploads', '/uploads'),
  
  // 小程序配置（可选）
  APP_ID: getEnvOptional('TARO_APP_ID'),
} as const

/**
 * 获取完整的 API URL
 * @returns 完整的 API URL，如 http://localhost:3000/api/v1 或 /api/v1（当 BASE_URL 为空时使用相对路径）
 */
export function getApiUrl(): string {
  const baseUrl = ENV.BASE_URL
  const apiPath = ENV.SYSTEM_API_PATH
  
  // 如果 BASE_URL 为空，直接返回相对路径
  if (!baseUrl) {
    return apiPath.startsWith('/') ? apiPath : `/${apiPath}`
  }
  
  // 确保 baseUrl 不以 / 结尾，apiPath 以 / 开头
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '')
  const cleanApiPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`
  
  return `${cleanBaseUrl}${cleanApiPath}`
}

/**
 * 获取完整的上传文件 URL
 * @param filePath 文件路径（可选）
 * @returns 完整的上传文件 URL，如 http://localhost:3000/uploads/xxx.jpg 或 /uploads/xxx.jpg（当 BASE_URL 为空时使用相对路径）
 */
export function getUploadUrl(filePath?: string): string {
  const baseUrl = ENV.BASE_URL
  const uploadPath = ENV.SYSTEM_UPLOAD_PATH
  
  // 确保 uploadPath 以 / 开头
  const cleanUploadPath = uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`
  
  // 如果 BASE_URL 为空，直接返回相对路径
  if (!baseUrl) {
    if (!filePath) {
      return cleanUploadPath
    }
    const cleanFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`
    return `${cleanUploadPath}${cleanFilePath}`
  }
  
  // 确保 baseUrl 不以 / 结尾
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '')
  const fullUploadUrl = `${cleanBaseUrl}${cleanUploadPath}`
  
  if (!filePath) {
    return fullUploadUrl
  }
  
  // 确保 filePath 以 / 开头
  const cleanFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`
  
  return `${fullUploadUrl}${cleanFilePath}`
}
