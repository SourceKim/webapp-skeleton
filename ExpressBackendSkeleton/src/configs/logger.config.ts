import { createLogger, type LoggerOptions } from '@skeleton/shared-utils/logger';
import { ENV } from './env.config';

// 验证日志级别是否有效
// ENV.LOG_LEVEL 通过 getEnv 获取，保证不会是 undefined
const logLevel: string = ENV.LOG_LEVEL;
const validLevels = ['error', 'warn', 'info', 'http', 'debug'] as const;
type ValidLogLevel = typeof validLevels[number];

// 类型守卫函数
function isValidLogLevel(level: string): level is ValidLogLevel {
  return validLevels.includes(level as ValidLogLevel);
}

if (!isValidLogLevel(logLevel)) {
  throw new Error(`环境变量 LOG_LEVEL 值无效: "${logLevel}"，必须是以下之一: ${validLevels.join(', ')}`);
}

// 此时 TypeScript 知道 logLevel 是有效的日志级别
const validatedLogLevel: LoggerOptions['level'] = logLevel;

// 使用共享的 logger 工具创建 logger 实例
export const loggerConfig = createLogger({
  level: validatedLogLevel,
  logDir: 'logs/app',
  enableConsole: true,
  enableFile: true,
  errorLogFile: 'error.log',
  combinedLogFile: 'combined.log',
  maxFileSize: 5242880, // 5MB
  maxErrorFiles: 5,
  maxCombinedFiles: 10,
}); 