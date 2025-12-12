/**
 * 环境变量配置工具（Taro 前端版本）
 * 
 * 适配 Taro 的 process.env（通过 Vite define 注入），提供与 Node.js 版本相同的 API
 * 所有环境变量都从此工具读取，如果未设置必需的环境变量则报错
 * 
 * 注意：Taro 项目使用 process.env，环境变量需要以 TARO_APP_ 开头才能被访问
 * Taro 通过 Vite 的 define 功能在构建时将环境变量注入到 process.env 中
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
 * @param key 环境变量键名（Taro 环境变量需要以 TARO_APP_ 开头）
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
  const env = getProcessEnv()
  const value = env[key]
  
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
  const env = getProcessEnv()
  const value = env[key]
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
 * 注意：Taro 环境变量通过 process.env 访问，只能打印以 TARO_APP_ 开头的变量
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

  const env = getProcessEnv()
  const sensitiveKeywords = ['password', 'secret', 'key', 'token', 'auth', 'credential']
  const envVars: Record<string, string> = {}
  
  // 只处理以 TARO_APP_ 开头的环境变量
  for (const key in env) {
    if (key.startsWith('TARO_APP_')) {
      let value = String(env[key] || '')
      
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
      
      envVars[key] = value
    }
  }
  
  // 按 key 排序
  const sortedEnv = Object.keys(envVars)
    .sort()
    .reduce((acc, key) => {
      acc[key] = envVars[key]
      return acc
    }, {} as Record<string, string>)
  
  if (output === 'object') {
    return sortedEnv
  }
  
  if (output === 'string') {
    const lines = Object.entries(sortedEnv).map(([key, value]) => `${key}=${value}`)
    return lines.join('\n')
  }
  
  // 默认输出到控制台（仅在开发环境）
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('\n========== 环境变量列表 (Taro) ==========')
    console.log('注意：只能访问以 TARO_APP_ 开头的环境变量\n')
    console.log(`共 ${Object.keys(sortedEnv).length} 个环境变量\n`)
    
    for (const [key, value] of Object.entries(sortedEnv)) {
      console.log(`${key}=${value}`)
    }
    
    console.log('\n===================================\n')
  }
}
