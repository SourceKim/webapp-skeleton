/**
 * 环境变量配置工具（Vite 前端版本）
 * 
 * 适配 Vite 的 import.meta.env，提供与 Node.js 版本相同的 API
 * 所有环境变量都从此工具读取，如果未设置必需的环境变量则报错
 * 
 * 注意：前端项目使用 import.meta.env，而不是 process.env
 * Vite 环境变量需要以 VITE_ 开头才能被访问
 */

// 类型定义：确保 import.meta.env 的类型正确
declare global {
  interface ImportMetaEnv {
    readonly [key: string]: string | boolean | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

/**
 * 获取环境变量，如果未赋值则直接报错
 * @param key 环境变量键名（Vite 环境变量需要以 VITE_ 开头）
 * @param description 环境变量的描述信息（用于错误提示）
 * @param defaultValue 默认值（如果提供了默认值，则不会报错）
 * @param allowEmpty 是否允许空字符串（默认 false）
 * @returns 环境变量的值
 * @throws Error 如果环境变量未设置且没有默认值
 */
export function getEnv(
  key: string,
  description?: string,
  defaultValue?: string,
  allowEmpty: boolean = false
): string {
  const value = import.meta.env[key] as string | undefined
  
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
  const value = import.meta.env[key] as string | undefined
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

/**
 * 打印所有环境变量（开发环境）
 * 注意：前端环境变量通过 import.meta.env 访问，只能打印 Vite 暴露的变量
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

  if (import.meta.env.DEV) {
    const env: Record<string, string> = {}
    const sensitiveKeywords = ['password', 'secret', 'key', 'token', 'auth', 'credential']
    
    for (const key in import.meta.env) {
      if (key.startsWith('VITE_')) {
        let value = String(import.meta.env[key] as string | boolean | undefined)
        
        // 应用过滤函数
        if (filter && !filter(key, value)) {
          continue
        }
        
        // 处理敏感信息
        if (maskSensitive) {
          const isSensitive = sensitiveKeywords.some(keyword =>
            key.toLowerCase().includes(keyword.toLowerCase())
          )
          if (isSensitive && value) {
            value = '***'
          }
        }
        
        env[key] = value
      }
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
    console.log('\n========== 环境变量列表 (Vite) ==========')
    console.log('注意：只能访问以 VITE_ 开头的环境变量\n')
    console.log(`共 ${Object.keys(sortedEnv).length} 个环境变量\n`)
    
    for (const [key, value] of Object.entries(sortedEnv)) {
      console.log(`${key}=${value}`)
    }
    
    console.log('\n===================================\n')
  }
}
