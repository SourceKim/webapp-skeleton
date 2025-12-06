import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// 环境变量加载优先级：
// 1. .env (基础配置，必须包含 NODE_ENV)
// 2. .env.local (本地所有环境通用配置，不提交到版本控制)
// 3. .env.${NODE_ENV} (环境特定配置)
// 4. .env.${NODE_ENV}.local (本地开发环境特定配置，不提交到版本控制)

// 先加载基础 .env 文件（用于获取 NODE_ENV）
const baseEnvPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(baseEnvPath)) {
  dotenv.config({ path: baseEnvPath });
}

/**
 * 获取环境变量，如果未赋值则直接报错
 * @param key 环境变量键名
 * @param description 环境变量的描述信息（用于错误提示）
 * @param allowEmpty 是否允许空字符串（默认 false），用于密码等可能为空但必须存在的字段
 * @returns 环境变量的值
 * @throws Error 如果环境变量未设置
 */
export function getEnv(key: string, description?: string, allowEmpty: boolean = false): string {
  const value = process.env[key];
  
  // 如果允许空字符串，只检查 undefined；否则空字符串也视为未设置
  if (value === undefined || (!allowEmpty && value === '')) {
    const desc = description ? ` (${description})` : '';
    throw new Error(
      `缺少必需的环境变量: ${key}${desc}\n` +
      `请在 .env 文件中配置此环境变量`
    );
  }
  
  return value;
}

/**
 * 获取环境变量（可选），如果未赋值则返回 undefined
 * @param key 环境变量键名
 * @returns 环境变量的值或 undefined
 */
export function getEnvOptional(key: string): string | undefined {
  const value = process.env[key];
  return value === '' ? undefined : value;
}

// 获取 NODE_ENV（必须在加载其他环境文件之前）
const NODE_ENV = getEnv('NODE_ENV', '运行环境，如 development、production');

// 定义可能的环境变量文件路径（按优先级）
const envPaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), `.env.${NODE_ENV}`),
  path.resolve(process.cwd(), `.env.${NODE_ENV}.local`),
];

// 按优先级加载存在的环境变量文件
envPaths.forEach(envPath => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

/**
 * 解析单个前端地址，自动生成 localhost 和 127.0.0.1 的变体
 * 必须传入完整的 URL（包含协议），例如：http://localhost:5173
 */
function parseOriginAddress(address: string, type: 'admin' | 'app'): string[] {
  const trimmed = address.trim();
  
  if (!trimmed) {
    throw new Error(`环境变量 CORS_${type.toUpperCase()}_ORIGIN 不能为空`);
  }

  // 检查是否包含协议
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    throw new Error(`环境变量 CORS_${type.toUpperCase()}_ORIGIN 格式错误: "${trimmed}"\n必须传入完整的 URL（包含协议），例如: http://localhost:5173 或 https://example.com`);
  }

  // 解析 URL
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch (error) {
    throw new Error(`环境变量 CORS_${type.toUpperCase()}_ORIGIN 格式错误: "${trimmed}"\n必须传入有效的完整 URL，例如: http://localhost:5173 或 https://example.com`);
  }

  const protocol = url.protocol;
  const port = url.port || (protocol === 'https:' ? '443' : '80');
  // 标准端口不显示端口号
  const portPart = (port === '80' && protocol === 'http:') || (port === '443' && protocol === 'https:') 
    ? '' 
    : `:${port}`;

  // 如果 hostname 是 localhost 或 127.0.0.1，生成两个变体
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return [
      `${protocol}//localhost${portPart}`,
      `${protocol}//127.0.0.1${portPart}`
    ];
  }

  // 其他域名，直接返回
  return [url.toString()];
}

/**
 * 解析 CORS 允许的来源配置
 * 需要提供两个环境变量：
 * - CORS_ADMIN_ORIGIN: admin 前端的地址
 * - CORS_APP_ORIGIN: app 前端的地址
 */
function parseCorsOrigins(): string[] {
  const adminOrigin = getEnv('CORS_ADMIN_ORIGIN', 'admin 前端的完整地址，例如: http://localhost:5173');
  const appOrigin = getEnv('CORS_APP_ORIGIN', 'app 前端的完整地址，例如: http://localhost:10086');

  const adminOrigins = parseOriginAddress(adminOrigin, 'admin');
  const appOrigins = parseOriginAddress(appOrigin, 'app');

  // 合并并去重
  const allOrigins = [...adminOrigins, ...appOrigins];
  return Array.from(new Set(allOrigins));
}

// 导出一些常用的环境变量配置
export const ENV = {
  NODE_ENV,
  PORT: getEnv('PORT', '服务器端口号'),
  API_BASE_URL: getEnv('API_BASE_URL', 'API 基础路径，如 /api/v1'),
  CORS_ORIGINS: parseCorsOrigins(),
  CORS_METHODS: getEnvOptional('CORS_METHODS')?.split(',').map(s => s.trim()).filter(Boolean) || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  CORS_HEADERS: getEnvOptional('CORS_HEADERS')?.split(',').map(s => s.trim()).filter(Boolean) || ['Content-Type', 'Authorization'],
  UPLOADS_PATH: getEnv('UPLOADS_PATH', '上传文件访问路径，如 /uploads'),
  PUBLIC_PATH: getEnv('PUBLIC_PATH', '静态文件访问路径，如 /public'),
  API_DOCS_JSON_PATH: getEnv('API_DOCS_JSON_PATH', 'API 文档 JSON 路径，如 /api-docs.json'),
  API_DOCS_PATH: getEnv('API_DOCS_PATH', 'API 文档访问路径，如 /api-docs'),
  LOG_LEVEL: getEnv('LOG_LEVEL', '日志级别，如 debug、info、warn、error'),
  
  // 数据库配置
  MYSQL_HOST: getEnv('MYSQL_HOST', 'MySQL 数据库主机地址'),
  MYSQL_PORT: getEnv('MYSQL_PORT', 'MySQL 数据库端口号'),
  MYSQL_USER: getEnv('MYSQL_USER', 'MySQL 数据库用户名'),
  MYSQL_PASSWORD: getEnv('MYSQL_PASSWORD', 'MySQL 数据库密码', true), // 允许空密码
  MYSQL_DATABASE: getEnv('MYSQL_DATABASE', 'MySQL 数据库名称'),

  // JWT配置
  JWT_SECRET: getEnv('JWT_SECRET', 'JWT 密钥，用于签名 token'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', 'JWT token 过期时间，如 24h、7d'),

  // 素材管理配置
  UPLOAD_DIR: getEnv('UPLOAD_DIR', '文件上传存储目录路径'),
  API_URL: getEnv('API_URL', 'API 服务完整 URL，如 http://localhost:3000'),
  MAX_FILE_SIZE: parseInt(getEnv('MAX_FILE_SIZE', '最大文件上传大小（字节），如 10485760（10MB）')),
  ALLOWED_MIME_TYPES: getEnvOptional('ALLOWED_MIME_TYPES')?.split(',').map(s => s.trim()).filter(Boolean) || ['image/*', 'audio/*', 'video/*', 'application/pdf', 'text/plain'],
};

// 注意：这里不能使用 logger，因为 logger 可能依赖于环境变量配置
// 环境变量加载完成信息会在 logger 初始化后输出 