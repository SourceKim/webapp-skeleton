/**
 * 环境变量配置工具（Vite 前端版本）
 * 
 * 使用 @skeleton/shared-utils/env/vite 提供的工具函数
 * 所有环境变量都从此工具读取，如果未设置必需的环境变量则报错
 * 
 * 注意：前端项目使用 import.meta.env，而不是 process.env
 * Vite 环境变量需要以 VITE_ 开头才能被访问
 */

// 从共享工具库导入 Vite 版本的环境变量工具
import {
  getEnv,
  getEnvOptional,
  getEnvNumber,
  getEnvBoolean,
  getEnvArray,
  printAllEnv
} from '@skeleton/shared-utils/env/vite'

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
 */
export const ENV = {
  // 基础配置
  BASE_URL: getEnv('VITE_BASE_URL', '基础 URL（完整地址，包含协议和端口），如 http://localhost:3000。为空时使用相对路径，避免跨域问题', ''),
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
