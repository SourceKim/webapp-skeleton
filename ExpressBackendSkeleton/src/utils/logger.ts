/**
 * 日志工具
 * 
 * 使用 @skeleton/shared-utils/logger 提供的日志工具
 * 提供请求上下文跟踪和便捷的日志记录函数
 */

import { loggerConfig } from '@/configs/logger.config';
import {
  setLogContext,
  getLogContext,
  clearLogContext,
  createLogFunctions,
} from '@skeleton/shared-utils/logger';

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