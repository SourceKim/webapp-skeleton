/**
 * 日志工具（Vite 前端版本）
 * 
 * 使用 @skeleton/shared-utils/logger/vite 提供的日志工具
 * 提供请求上下文跟踪和便捷的日志记录函数
 */

import { ENV } from './env';
import {
  setLogContext,
  getLogContext,
  clearLogContext,
  createLogger,
  createLogFunctions,
  type LoggerOptions,
} from '@skeleton/shared-utils/logger/vite';

/**
 * 从环境变量获取日志级别
 */
function getLogLevel(): LoggerOptions['level'] {
  // Vite 环境变量需要以 VITE_ 开头
  const level = import.meta.env.VITE_LOG_LEVEL || 'info';
  const validLevels = ['error', 'warn', 'info', 'http', 'debug'] as const;
  
  if (!validLevels.includes(level as any)) {
    console.warn(`无效的日志级别: ${level}，使用默认值: info`);
    return 'info';
  }
  
  return level as LoggerOptions['level'];
}

// 创建 logger 实例
const loggerConfig = createLogger({
  level: getLogLevel(),
  enableConsole: true,
  enableDevLogs: true, // 开发环境输出所有日志
  showTimestamp: true,
  showLevel: true,
});

// 创建便捷的日志记录函数
const logFunctions = createLogFunctions(loggerConfig);

// 导出 logger 实例和日志函数
export const logger = loggerConfig;

export {
  setLogContext,
  getLogContext,
  clearLogContext,
};

export const logError = logFunctions.error;
export const logWarn = logFunctions.warn;
export const logInfo = logFunctions.info;
export const logHttp = logFunctions.http;
export const logDebug = logFunctions.debug;

// 默认导出
export default {
  logger,
  logError,
  logWarn,
  logInfo,
  logHttp,
  logDebug,
  setLogContext,
  getLogContext,
  clearLogContext,
};
