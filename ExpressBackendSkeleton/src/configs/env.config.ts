/**
 * 环境变量配置
 * 
 * 使用 @skeleton/shared-utils/env 提供的环境变量管理工具
 * 
 * 环境变量加载优先级：
 * 1. 系统环境变量（最高优先级）
 * 2. .env (基础配置)
 * 3. .env.local (本地所有环境通用配置，不提交到版本控制)
 * 4. .env.${NODE_ENV} (环境特定配置)
 * 5. .env.${NODE_ENV}.local (本地开发环境特定配置，不提交到版本控制)
 */

import {
  loadEnv,
  getEnv,
  getEnvOptional,
  getEnvNumber,
  getEnvArray,
  printAllEnv
} from '@skeleton/shared-utils/env'

// 加载环境变量文件
const loadedFiles = loadEnv()
if (process.env.NODE_ENV === 'development') {
  console.log('已加载的环境文件:', loadedFiles)
  // 开发环境打印所有环境变量（隐藏敏感信息）
  printAllEnv()
}

// 获取 NODE_ENV
const NODE_ENV = getEnv('NODE_ENV', '运行环境，如 development、production')

/**
 * 解析单个前端地址，自动生成 localhost 和 127.0.0.1 的变体
 * 必须传入完整的 URL（包含协议），例如：http://localhost:5173
 */
function parseOriginAddress(address: string, type: 'admin' | 'app'): string[] {
  const trimmed = address.trim()
  
  if (!trimmed) {
    throw new Error(`环境变量 CORS_${type.toUpperCase()}_ORIGIN 不能为空`)
  }

  // 检查是否包含协议
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    throw new Error(`环境变量 CORS_${type.toUpperCase()}_ORIGIN 格式错误: "${trimmed}"\n必须传入完整的 URL（包含协议），例如: http://localhost:5173 或 https://example.com`)
  }

  // 解析 URL
  let url: URL
  try {
    url = new URL(trimmed)
  } catch (error) {
    throw new Error(`环境变量 CORS_${type.toUpperCase()}_ORIGIN 格式错误: "${trimmed}"\n必须传入有效的完整 URL，例如: http://localhost:5173 或 https://example.com`)
  }

  const protocol = url.protocol
  const port = url.port || (protocol === 'https:' ? '443' : '80')
  // 标准端口不显示端口号
  const portPart = (port === '80' && protocol === 'http:') || (port === '443' && protocol === 'https:') 
    ? '' 
    : `:${port}`

  // 如果 hostname 是 localhost 或 127.0.0.1，生成两个变体
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return [
      `${protocol}//localhost${portPart}`,
      `${protocol}//127.0.0.1${portPart}`
    ]
  }

  // 其他域名，直接返回
  return [url.toString()]
}

/**
 * 解析 CORS 允许的来源配置
 * 需要提供两个环境变量：
 * - CORS_ADMIN_ORIGIN: admin 前端的地址
 * - CORS_APP_ORIGIN: app 前端的地址
 */
function parseCorsOrigins(): string[] {
  const adminOrigin = getEnv('CORS_ADMIN_ORIGIN', 'admin 前端的完整地址，例如: http://localhost:5173')
  const appOrigin = getEnv('CORS_APP_ORIGIN', 'app 前端的完整地址，例如: http://localhost:10086')

  const adminOrigins = parseOriginAddress(adminOrigin, 'admin')
  const appOrigins = parseOriginAddress(appOrigin, 'app')

  // 合并并去重
  const allOrigins = [...adminOrigins, ...appOrigins]
  return Array.from(new Set(allOrigins))
}

// 导出一些常用的环境变量配置
export const ENV = {
  NODE_ENV,
  PORT: getEnvNumber('PORT', '服务器端口号'),
  CORS_ORIGINS: parseCorsOrigins(),
  CORS_METHODS: getEnvArray('CORS_METHODS', 'CORS 允许的 HTTP 方法', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
  CORS_HEADERS: getEnvArray('CORS_HEADERS', 'CORS 允许的请求头', ['Content-Type', 'Authorization']),
  UPLOADS_PATH: getEnv('UPLOADS_PATH', '上传文件访问路径，如 /uploads'),
  PUBLIC_PATH: getEnv('PUBLIC_PATH', '静态文件访问路径，如 /public'),
  API_DOCS_JSON_PATH: getEnv('API_DOCS_JSON_PATH', 'API 文档 JSON 路径，如 /api-docs.json'),
  API_DOCS_PATH: getEnv('API_DOCS_PATH', 'API 文档访问路径，如 /api-docs'),
  API_VERSION: getEnvOptional('API_VERSION') || '/api/v1', // API 版本路径，默认 /api/v1
  LOG_LEVEL: getEnv('LOG_LEVEL', '日志级别，如 debug、info、warn、error'),
  
  // 数据库配置
  MYSQL_HOST: getEnv('MYSQL_HOST', 'MySQL 数据库主机地址'),
  MYSQL_PORT: getEnvNumber('MYSQL_PORT', 'MySQL 数据库端口号'),
  MYSQL_USER: getEnv('MYSQL_USER', 'MySQL 数据库用户名'),
  MYSQL_PASSWORD: getEnv('MYSQL_PASSWORD', 'MySQL 数据库密码', undefined, true), // 允许空密码
  MYSQL_DATABASE: getEnv('MYSQL_DATABASE', 'MySQL 数据库名称'),

  // JWT配置
  JWT_SECRET: getEnv('JWT_SECRET', 'JWT 密钥，用于签名 token'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', 'JWT token 过期时间，如 24h、7d'),

  // 素材管理配置
  MAX_FILE_SIZE: getEnvNumber('MAX_FILE_SIZE', '最大文件上传大小（字节），如 10485760（10MB）'),
  ALLOWED_MIME_TYPES: getEnvArray('ALLOWED_MIME_TYPES', '允许的 MIME 类型', ['image/*', 'audio/*', 'video/*', 'application/pdf', 'text/plain']),
}

// 注意：这里不能使用 logger，因为 logger 可能依赖于环境变量配置
// 环境变量加载完成信息会在 logger 初始化后输出
