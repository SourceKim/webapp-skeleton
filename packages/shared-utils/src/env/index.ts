/**
 * 环境变量管理工具
 * 
 * 适用于 Node.js 环境（Express 后端）
 * 提供环境变量的加载、读取和打印功能
 * 
 * 环境变量加载优先级：
 * 1. 系统环境变量（最高优先级）
 * 2. .env (基础配置)
 * 3. .env.local (本地所有环境通用配置，不提交到版本控制)
 * 4. .env.${NODE_ENV} (环境特定配置)
 * 5. .env.${NODE_ENV}.local (本地开发环境特定配置，不提交到版本控制)
 */

import * as path from 'path'
import * as fs from 'fs'

// 动态导入 dotenv，避免在非 Node.js 环境中报错
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dotenv: any = null
try {
  // @ts-ignore - dotenv 可能未安装，运行时动态加载
  dotenv = require('dotenv')
} catch (e) {
  // dotenv 未安装或不在 Node.js 环境
}

/**
 * 已加载的环境文件路径集合
 */
const loadedEnvFiles = new Set<string>()

/**
 * 加载环境变量文件
 * @param options 加载选项
 * @param options.cwd 工作目录，默认为 process.cwd()
 * @param options.nodeEnv 运行环境，如果不提供则从环境变量或文件中读取
 * @param options.override 是否覆盖已存在的环境变量，默认 false（系统环境变量优先级最高）
 * @returns 加载的环境文件路径数组
 */
export function loadEnv(options?: {
  cwd?: string
  nodeEnv?: string
  override?: boolean
}): string[] {
  if (!dotenv) {
    throw new Error(
      'dotenv 未安装。请在项目中安装 dotenv: npm install dotenv 或 pnpm add dotenv'
    )
  }

  const cwd = options?.cwd || process.cwd()
  const override = options?.override || false
  let nodeEnv = options?.nodeEnv || process.env.NODE_ENV

  const loadedFiles: string[] = []

  // 如果系统环境变量中没有 NODE_ENV，尝试从环境文件中加载
  if (!nodeEnv) {
    const possibleEnvFiles = [
      path.resolve(cwd, '.env'),
      path.resolve(cwd, '.env.local'),
      path.resolve(cwd, '.env.development'),
      path.resolve(cwd, '.env.development.local'),
      path.resolve(cwd, '.env.production'),
      path.resolve(cwd, '.env.production.local'),
    ]

    for (const envPath of possibleEnvFiles) {
      if (fs.existsSync(envPath)) {
        const result = dotenv!.config({ path: envPath, override })
        if (result.error) {
          console.warn(`加载环境文件失败: ${envPath}`, result.error)
        } else {
          loadedFiles.push(envPath)
          loadedEnvFiles.add(envPath)
          if (process.env.NODE_ENV) {
            nodeEnv = process.env.NODE_ENV
            break
          }
        }
      }
    }
  }

  // 根据 NODE_ENV 加载对应的环境文件（如果之前没有加载过）
  if (nodeEnv) {
    const envPaths = [
      path.resolve(cwd, '.env'),
      path.resolve(cwd, '.env.local'),
      path.resolve(cwd, `.env.${nodeEnv}`),
      path.resolve(cwd, `.env.${nodeEnv}.local`),
    ]

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath) && !loadedEnvFiles.has(envPath)) {
        const result = dotenv!.config({ path: envPath, override })
        if (result.error) {
          console.warn(`加载环境文件失败: ${envPath}`, result.error)
        } else {
          loadedFiles.push(envPath)
          loadedEnvFiles.add(envPath)
        }
      }
    }
  }

  return loadedFiles
}

/**
 * 打印所有环境变量
 * @param options 打印选项
 * @param options.maskSensitive 是否隐藏敏感信息（默认 true），会隐藏包含 password、secret、key、token 等关键词的变量值
 * @param options.filter 过滤函数，返回 true 表示显示该环境变量
 * @param options.output 输出方式，'console' 输出到控制台，'object' 返回对象，'string' 返回格式化的字符串
 */
export function printAllEnv(options?: {
  maskSensitive?: boolean
  filter?: (key: string, value: string) => boolean
  output?: 'console' | 'object' | 'string'
}): Record<string, string> | string | void {
  const {
    maskSensitive = true,
    filter,
    output = 'console'
  } = options || {}

  const env: Record<string, string> = {}
  const sensitiveKeywords = ['password', 'secret', 'key', 'token', 'auth', 'credential']

  for (const [key, value] of Object.entries(process.env)) {
    // 应用过滤函数
    if (filter && !filter(key, value || '')) {
      continue
    }

    // 处理敏感信息
    let displayValue = value || ''
    if (maskSensitive) {
      const isSensitive = sensitiveKeywords.some(keyword =>
        key.toLowerCase().includes(keyword.toLowerCase())
      )
      if (isSensitive && displayValue) {
        displayValue = '***'
      }
    }

    env[key] = displayValue
  }

  // 按 key 排序
  const sortedEnv = Object.keys(env)
    .sort()
    .reduce((acc, key) => {
      acc[key] = env[key]
      return acc
    }, {} as Record<string, string>)

  if (output === 'object') {
    return sortedEnv
  }

  if (output === 'string') {
    const lines = Object.entries(sortedEnv).map(([key, value]) => `${key}=${value}`)
    return lines.join('\n')
  }

  // 默认输出到控制台
  console.log('\n========== 环境变量列表 ==========')
  console.log(`共 ${Object.keys(sortedEnv).length} 个环境变量\n`)
  
  for (const [key, value] of Object.entries(sortedEnv)) {
    console.log(`${key}=${value}`)
  }
  
  console.log('\n===================================\n')
}

/**
 * 获取环境变量，如果未赋值则直接报错
 * @param key 环境变量键名
 * @param description 环境变量的描述信息（用于错误提示）
 * @param defaultValue 默认值（如果提供了默认值，则不会报错）
 * @param allowEmpty 是否允许空字符串（默认 false），用于密码等可能为空但必须存在的字段
 * @returns 环境变量的值
 * @throws Error 如果环境变量未设置且没有默认值
 */
export function getEnv(
  key: string,
  description?: string,
  defaultValue?: string,
  allowEmpty: boolean = false
): string {
  const value = process.env[key]

  // 如果允许空字符串，只检查 undefined；否则空字符串也视为未设置
  if (value === undefined || (!allowEmpty && value === '')) {
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
  const value = process.env[key]
  return value === '' ? undefined : value
}

/**
 * 获取数字类型的环境变量
 * @param key 环境变量键名
 * @param description 环境变量的描述信息
 * @param defaultValue 默认值
 * @returns 数字类型的值
 */
export function getEnvNumber(
  key: string,
  description?: string,
  defaultValue?: number
): number {
  const value = getEnvOptional(key)
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    const desc = description ? ` (${description})` : ''
    throw new Error(`缺少必需的环境变量: ${key}${desc}`)
  }
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    throw new Error(`环境变量 ${key} 必须是数字类型，当前值: ${value}`)
  }
  return num
}

/**
 * 获取布尔类型的环境变量
 * @param key 环境变量键名
 * @param description 环境变量的描述信息
 * @param defaultValue 默认值
 * @returns 布尔类型的值
 */
export function getEnvBoolean(
  key: string,
  description?: string,
  defaultValue?: boolean
): boolean {
  const value = getEnvOptional(key)
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    const desc = description ? ` (${description})` : ''
    throw new Error(`缺少必需的环境变量: ${key}${desc}`)
  }
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * 获取数组类型的环境变量（逗号分隔）
 * @param key 环境变量键名
 * @param description 环境变量的描述信息
 * @param defaultValue 默认值
 * @returns 字符串数组
 */
export function getEnvArray(
  key: string,
  description?: string,
  defaultValue?: string[]
): string[] {
  const value = getEnvOptional(key)
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    const desc = description ? ` (${description})` : ''
    throw new Error(`缺少必需的环境变量: ${key}${desc}`)
  }
  return value.split(',').map(s => s.trim()).filter(Boolean)
}
