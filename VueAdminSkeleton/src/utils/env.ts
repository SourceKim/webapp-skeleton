/**
 * 环境变量配置工具
 * 参考 ExpressBackendSkeleton/src/configs/env.config.ts
 * 
 * 所有环境变量都从此工具读取，如果未设置必需的环境变量则报错
 */

/**
 * 获取环境变量，如果未赋值则直接报错
 * @param key 环境变量键名
 * @param description 环境变量的描述信息（用于错误提示）
 * @param defaultValue 默认值（如果提供了默认值，则不会报错）
 * @returns 环境变量的值
 * @throws Error 如果环境变量未设置且没有默认值
 */
export function getEnv(key: string, description?: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  
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
  const value = import.meta.env[key]
  return value === '' ? undefined : value
}

/**
 * 环境变量配置对象
 * 所有环境变量都从此对象读取
 */
export const ENV = {
  // 基础配置
  BASE_URL: getEnv('VITE_BASE_URL', '基础 URL（完整地址，包含协议和端口），如 http://localhost:3000'),
  SYSTEM_BASE_URL: getEnv('VITE_SYSTEM_API_PATH', 'API 基础路径（相对路径），如 /api/v1', '/api/v1'),
  UPLOAD_BASE_URL: getEnv('VITE_SYSTEM_UPLOAD_PATH', '上传文件访问路径（相对路径），如 /uploads', '/uploads'),
  SYS_TOKEN_KEY: getEnv('VITE_SYS_TOKEN_KEY', 'Token 存储的 key', 'Authorization'),
  
  // 路由配置
  LAYOUT_ROUTE_NAME: getEnv('VITE_LAYOUT_ROUTE_NAME', '路由前缀，如 admin'),
  
  // 系统信息
  TITLE: getEnv('VITE_TITLE', '系统标题'),
  
  // 高德地图配置
  AMAP_KEY: getEnv('VITE_AMAP_KEY', '高德地图 API Key'),
  AMAP_SECURITY_CODE: getEnv('VITE_AMAP_SECURITY_CODE', '高德地图安全密钥'),
  
  // 备案信息（可选）
  ICP_CODE: getEnvOptional('VITE_ICP_CODE'),
  PSB_CODE: getEnvOptional('VITE_PSB_CODE'),
  
  // 版权信息（可选）
  COPYRIGHT_YEAR: getEnvOptional('VITE_COPYRIGHT_YEAR'),
  COPYRIGHT_OWNER: getEnvOptional('VITE_COPYRIGHT_OWNER'),
  
  // Vite 内置环境变量
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const
