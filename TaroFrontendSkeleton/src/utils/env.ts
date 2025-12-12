/**
 * 环境变量配置工具（Taro 前端版本）
 * 
 * 使用 @skeleton/shared-utils/env/taro 提供的工具函数
 * 所有环境变量都从此工具读取，如果未设置必需的环境变量则报错
 * 
 * 注意：Taro 项目使用 process.env，环境变量需要以 TARO_APP_ 开头才能被访问
 * Taro 通过 Vite 的 define 功能在构建时将环境变量注入到 process.env 中
 */

// 从共享工具库导入 Taro 版本的环境变量工具
import {
  getEnv,
  getEnvOptional,
  getEnvNumber,
  getEnvBoolean,
  getEnvArray,
  printAllEnv
} from '@skeleton/shared-utils/env/taro'

// 重新导出所有工具函数
export {
  getEnv,
  getEnvOptional,
  getEnvNumber,
  getEnvBoolean,
  getEnvArray,
  printAllEnv
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
