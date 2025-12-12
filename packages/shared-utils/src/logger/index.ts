/**
 * 日志工具（Node.js 版本）
 * 
 * 适用于 Node.js 环境（Express 后端）
 * 提供基于 Winston 的日志记录功能，支持请求上下文跟踪
 * 
 * 功能特性：
 * - 支持多级别日志（error、warn、info、http、debug）
 * - 支持请求上下文跟踪（requestId、userId 等）
 * - 支持自定义日志格式和传输目标
 * - 自动创建日志目录和文件
 * 
 * 注意：此模块需要 winston 作为 peerDependency
 */

// 动态导入 winston，避免在非 Node.js 环境中报错
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let winston: any = null;
try {
  // @ts-ignore - winston 可能未安装，运行时动态加载
  winston = require('winston');
} catch (e) {
  // winston 未安装或不在 Node.js 环境
  throw new Error(
    'winston 未安装。请在项目中安装 winston: npm install winston 或 pnpm add winston'
  );
}
import * as path from 'path';
import * as fs from 'fs';

/**
 * 日志级别定义
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
   */
  level?: LogLevel;
  
  /**
   * 日志目录路径，默认为 'logs/app'
   */
  logDir?: string;
  
  /**
   * 是否启用控制台输出，默认为 true
   */
  enableConsole?: boolean;
  
  /**
   * 是否启用文件输出，默认为 true
   */
  enableFile?: boolean;
  
  /**
   * 错误日志文件名，默认为 'error.log'
   */
  errorLogFile?: string;
  
  /**
   * 综合日志文件名，默认为 'combined.log'
   */
  combinedLogFile?: string;
  
  /**
   * 单个日志文件最大大小（字节），默认为 5MB
   */
  maxFileSize?: number;
  
  /**
   * 错误日志文件最大数量，默认为 5
   */
  maxErrorFiles?: number;
  
  /**
   * 综合日志文件最大数量，默认为 10
   */
  maxCombinedFiles?: number;
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
 * 自定义序列化函数，确保显示 undefined 值
 */
function customStringify(obj: any): string {
  return JSON.stringify(obj, (_key, value) => {
    if (value === undefined) {
      return 'undefined';
    }
    return value;
  }, 2);
}

/**
 * 创建日志格式
 */
function createLogFormat() {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );
}

/**
 * 创建控制台输出格式
 */
function createConsoleFormat() {
  return winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info: any) => {
      // 提取基本字段
      const { timestamp, level, message, stack, ...meta } = info;
      
      // 构建基本日志信息
      let log = `${timestamp} ${level}: ${message}`;
      
      // 如果有堆栈信息，添加堆栈
      if (stack) {
        log += '\n' + stack;
      }
      
      // 使用自定义序列化，确保显示所有字段
      if (Object.keys(meta).length > 0) {
        log += '\n' + customStringify(meta);
      }
      
      return log;
    })
  );
}

/**
 * 创建 Winston Logger 实例
 * @param options 日志配置选项
 * @returns Winston Logger 实例
 */
export function createLogger(options: LoggerOptions = {}): any {
  const {
    level = 'info',
    logDir = path.join(process.cwd(), 'logs/app'),
    enableConsole = true,
    enableFile = true,
    errorLogFile = 'error.log',
    combinedLogFile = 'combined.log',
    maxFileSize = 5242880, // 5MB
    maxErrorFiles = 5,
    maxCombinedFiles = 10,
  } = options;

  // 验证日志级别
  if (!Object.keys(LogLevels).includes(level)) {
    throw new Error(
      `日志级别无效: "${level}"，必须是以下之一: ${Object.keys(LogLevels).join(', ')}`
    );
  }

  // 确保日志目录存在
  if (enableFile && !fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // 定义日志传输目标
  const transports: any[] = [];

  // 控制台输出
  if (enableConsole) {
    transports.push(
      new winston.transports.Console({
        format: createConsoleFormat(),
      })
    );
  }

  // 文件输出
  if (enableFile) {
    // 错误日志文件
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, errorLogFile),
        level: 'error',
        maxsize: maxFileSize,
        maxFiles: maxErrorFiles,
      })
    );

    // 所有日志文件
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, combinedLogFile),
        maxsize: maxFileSize,
        maxFiles: maxCombinedFiles,
      })
    );
  }

  // 创建并返回 logger 实例
  return winston.createLogger({
    level,
    levels: LogLevels,
    format: createLogFormat(),
    transports,
  });
}

/**
 * 带上下文的日志记录函数
 * @param logger Winston Logger 实例
 * @param level 日志级别
 * @param message 日志消息
 * @param requestId 请求标识符（可选）
 * @param meta 其他元数据（可选）
 */
export function logWithContext(
  logger: any,
  level: LogLevel,
  message: string,
  requestId?: string,
  meta?: any
): void {
  const context = requestId ? getLogContext(requestId) : {};
  logger.log(level, message, { ...context, ...meta });
}

/**
 * 创建便捷的日志记录函数
 * @param logger Winston Logger 实例
 * @returns 日志记录函数对象
 */
export function createLogFunctions(logger: any) {
  return {
    /**
     * 记录错误日志
     */
    error: (message: string, requestId?: string, meta?: any): void => {
      logWithContext(logger, 'error', message, requestId, meta);
    },

    /**
     * 记录警告日志
     */
    warn: (message: string, requestId?: string, meta?: any): void => {
      logWithContext(logger, 'warn', message, requestId, meta);
    },

    /**
     * 记录信息日志
     */
    info: (message: string, requestId?: string, meta?: any): void => {
      logWithContext(logger, 'info', message, requestId, meta);
    },

    /**
     * 记录 HTTP 请求日志
     */
    http: (message: string, requestId?: string, meta?: any): void => {
      logWithContext(logger, 'http', message, requestId, meta);
    },

    /**
     * 记录调试日志
     */
    debug: (message: string, requestId?: string, meta?: any): void => {
      logWithContext(logger, 'debug', message, requestId, meta);
    },
  };
}
