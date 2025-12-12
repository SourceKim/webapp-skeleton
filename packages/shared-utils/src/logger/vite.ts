/**
 * 日志工具（Vite 前端版本）
 * 
 * 适用于 Vite 前端环境（Vue、React 等）
 * 提供基于 console 的日志记录功能，支持请求上下文跟踪
 * 
 * 功能特性：
 * - 支持多级别日志（error、warn、info、http、debug）
 * - 支持请求上下文跟踪（requestId、userId 等）
 * - 支持自定义日志格式
 * - 开发环境输出详细日志，生产环境可配置日志级别
 * 
 * 注意：前端环境使用 console API，不支持文件输出
 */

// 类型定义：确保 import.meta.env 的类型正确
declare global {
  interface ImportMetaEnv {
    readonly DEV?: boolean
    readonly PROD?: boolean
    readonly MODE?: string
    readonly [key: string]: string | boolean | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

/**
 * 日志级别定义（与 Node.js 版本保持一致）
 */
export const LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

export type LogLevel = keyof typeof LogLevels;

/**
 * 日志配置选项
 */
export interface LoggerOptions {
  /**
   * 日志级别，默认为 'info'
   * 低于此级别的日志将不会输出
   */
  level?: LogLevel;
  
  /**
   * 是否启用控制台输出，默认为 true
   */
  enableConsole?: boolean;
  
  /**
   * 是否在开发环境输出详细日志，默认为 true
   */
  enableDevLogs?: boolean;
  
  /**
   * 是否显示时间戳，默认为 true
   */
  showTimestamp?: boolean;
  
  /**
   * 是否显示日志级别，默认为 true
   */
  showLevel?: boolean;
}

/**
 * 请求跟踪 ID 中间件使用的上下文存储
 */
const contextStorage = new Map<string, any>();

/**
 * 设置日志上下文，可用于添加请求ID、用户ID等
 * @param requestId 请求标识符
 * @param context 上下文对象
 */
export function setLogContext(requestId: string, context: any): void {
  contextStorage.set(requestId, context);
}

/**
 * 获取日志上下文
 * @param requestId 请求标识符
 */
export function getLogContext(requestId: string): any {
  return contextStorage.get(requestId) || {};
}

/**
 * 清除日志上下文
 * @param requestId 请求标识符
 */
export function clearLogContext(requestId: string): void {
  contextStorage.delete(requestId);
}

/**
 * 格式化时间戳
 */
function formatTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * 格式化日志消息
 */
function formatMessage(
  level: LogLevel,
  message: string,
  options?: LoggerOptions
): string {
  const parts: string[] = [];
  
  if (options?.showTimestamp !== false) {
    parts.push(`[${formatTimestamp()}]`);
  }
  
  if (options?.showLevel !== false) {
    parts.push(`[${level.toUpperCase()}]`);
  }
  
  parts.push(message);
  
  return parts.join(' ');
}

/**
 * 获取 console 方法
 */
function getConsoleMethod(level: LogLevel): (...args: any[]) => void {
  switch (level) {
    case 'error':
      return console.error.bind(console);
    case 'warn':
      return console.warn.bind(console);
    case 'info':
      return console.info.bind(console);
    case 'http':
      return console.log.bind(console);
    case 'debug':
      return console.debug.bind(console);
    default:
      return console.log.bind(console);
  }
}

/**
 * 创建日志记录函数
 */
function createLogFunction(
  level: LogLevel,
  message: string,
  loggerOptions: LoggerOptions,
  requestId?: string,
  meta?: any
): void {
  // 检查日志级别
  const currentLevel = loggerOptions.level || 'info';
  if (LogLevels[level] > LogLevels[currentLevel]) {
    return; // 日志级别不够，不输出
  }
  
  // 检查是否启用控制台输出
  if (loggerOptions.enableConsole === false) {
    return;
  }
  
  // 检查开发环境日志
  const isDev = import.meta.env.DEV === true;
  if (!isDev && loggerOptions.enableDevLogs === false) {
    // 生产环境只输出 error 和 warn
    if (level !== 'error' && level !== 'warn') {
      return;
    }
  }
  
  // 获取上下文
  const context = requestId ? getLogContext(requestId) : {};
  const allMeta = { ...context, ...meta };
  
  // 格式化消息
  const formattedMessage = formatMessage(level, message, loggerOptions);
  
  // 获取 console 方法
  const consoleMethod = getConsoleMethod(level);
  
  // 输出日志
  if (Object.keys(allMeta).length > 0) {
    consoleMethod(formattedMessage, allMeta);
  } else {
    consoleMethod(formattedMessage);
  }
}

/**
 * 创建 Logger 实例
 * @param options 日志配置选项
 * @returns Logger 实例
 */
export function createLogger(options: LoggerOptions = {}) {
  const loggerOptions: LoggerOptions = {
    level: options.level || 'info',
    enableConsole: options.enableConsole !== false,
    enableDevLogs: options.enableDevLogs !== false,
    showTimestamp: options.showTimestamp !== false,
    showLevel: options.showLevel !== false,
  };
  
  return {
    /**
     * 记录错误日志
     */
    error: (message: string, requestId?: string, meta?: any): void => {
      createLogFunction('error', message, loggerOptions, requestId, meta);
    },
    
    /**
     * 记录警告日志
     */
    warn: (message: string, requestId?: string, meta?: any): void => {
      createLogFunction('warn', message, loggerOptions, requestId, meta);
    },
    
    /**
     * 记录信息日志
     */
    info: (message: string, requestId?: string, meta?: any): void => {
      createLogFunction('info', message, loggerOptions, requestId, meta);
    },
    
    /**
     * 记录 HTTP 请求日志
     */
    http: (message: string, requestId?: string, meta?: any): void => {
      createLogFunction('http', message, loggerOptions, requestId, meta);
    },
    
    /**
     * 记录调试日志
     */
    debug: (message: string, requestId?: string, meta?: any): void => {
      createLogFunction('debug', message, loggerOptions, requestId, meta);
    },
    
    /**
     * 通用日志方法
     */
    log: (level: LogLevel, message: string, meta?: any): void => {
      createLogFunction(level, message, loggerOptions, undefined, meta);
    },
  };
}

/**
 * 创建便捷的日志记录函数
 * @param logger Logger 实例
 * @returns 日志记录函数对象
 */
export function createLogFunctions(logger: ReturnType<typeof createLogger>) {
  return {
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
    info: logger.info.bind(logger),
    http: logger.http.bind(logger),
    debug: logger.debug.bind(logger),
  };
}
