# 环境变量管理工具使用指南

## 概述

`@skeleton/shared-utils/env` 提供了完整的环境变量管理功能，包括：
- 环境变量加载（从 .env 文件加载）
- 打印所有环境变量
- 读取环境变量（不存在则报错）

## 安装依赖

`dotenv` 已作为 Monorepo 的公共依赖安装在根目录，所有项目都可以直接使用，无需单独安装。

## 基本使用

### 1. 加载环境变量

```typescript
import { loadEnv } from '@skeleton/shared-utils/env'

// 自动加载环境变量（使用默认配置）
// 加载顺序：
// 1. 系统环境变量（最高优先级）
// 2. .env
// 3. .env.local
// 4. .env.${NODE_ENV}
// 5. .env.${NODE_ENV}.local
const loadedFiles = loadEnv()
console.log('已加载的环境文件:', loadedFiles)

// 自定义配置
const loadedFiles2 = loadEnv({
  cwd: '/path/to/project',  // 工作目录
  nodeEnv: 'production',    // 指定运行环境
  override: false           // 是否覆盖已存在的环境变量（默认 false）
})
```

### 2. 读取环境变量

#### 必需的环境变量（不存在则报错）

```typescript
import { getEnv } from '@skeleton/shared-utils/env'

// 基本用法
const port = getEnv('PORT', '服务器端口号')
// 如果 PORT 不存在，会抛出错误：
// Error: 缺少必需的环境变量: PORT (服务器端口号)
// 请在 .env 文件中配置此环境变量

// 带默认值
const port = getEnv('PORT', '服务器端口号', '3000')
// 如果 PORT 不存在，会使用默认值 '3000'

// 允许空字符串（用于密码等可能为空但必须存在的字段）
const password = getEnv('MYSQL_PASSWORD', 'MySQL 密码', undefined, true)
```

#### 可选的环境变量

```typescript
import { getEnvOptional } from '@skeleton/shared-utils/env'

const apiKey = getEnvOptional('API_KEY')
// 如果 API_KEY 不存在，返回 undefined
// 如果存在但为空字符串，也返回 undefined
```

#### 类型转换

```typescript
import { 
  getEnvNumber, 
  getEnvBoolean, 
  getEnvArray 
} from '@skeleton/shared-utils/env'

// 数字类型
const port = getEnvNumber('PORT', '服务器端口号', 3000)
// 如果 PORT 不是数字，会抛出错误

// 布尔类型
const debug = getEnvBoolean('DEBUG', '调试模式', false)
// 'true' 或 '1' 会被转换为 true，其他为 false

// 数组类型（逗号分隔）
const allowedOrigins = getEnvArray('CORS_ORIGINS', '允许的来源', ['*'])
// 'http://localhost:3000,http://localhost:3001' 
// 会被转换为 ['http://localhost:3000', 'http://localhost:3001']
```

### 3. 打印所有环境变量

```typescript
import { printAllEnv } from '@skeleton/shared-utils/env'

// 默认：输出到控制台，隐藏敏感信息
printAllEnv()
// 输出：
// ========== 环境变量列表 ==========
// 共 15 个环境变量
//
// NODE_ENV=development
// PORT=3000
// MYSQL_PASSWORD=***
// ...

// 显示敏感信息
printAllEnv({ maskSensitive: false })

// 过滤环境变量
printAllEnv({
  filter: (key, value) => {
    // 只显示以 APP_ 开头的环境变量
    return key.startsWith('APP_')
  }
})

// 返回对象而不是打印
const envObj = printAllEnv({ output: 'object' }) as Record<string, string>
console.log(envObj)

// 返回格式化的字符串
const envStr = printAllEnv({ output: 'string' }) as string
console.log(envStr)
```

## 完整示例

### Express 后端项目

```typescript
// src/configs/env.config.ts
import { loadEnv, getEnv, getEnvNumber, printAllEnv } from '@skeleton/shared-utils/env'

// 1. 加载环境变量
loadEnv()

// 2. 打印所有环境变量（开发环境）
if (process.env.NODE_ENV === 'development') {
  printAllEnv()
}

// 3. 读取环境变量
export const ENV = {
  NODE_ENV: getEnv('NODE_ENV', '运行环境'),
  PORT: getEnvNumber('PORT', '服务器端口号', 3000),
  MYSQL_HOST: getEnv('MYSQL_HOST', 'MySQL 主机地址'),
  MYSQL_PORT: getEnvNumber('MYSQL_PORT', 'MySQL 端口号', 3306),
  MYSQL_USER: getEnv('MYSQL_USER', 'MySQL 用户名'),
  MYSQL_PASSWORD: getEnv('MYSQL_PASSWORD', 'MySQL 密码', undefined, true), // 允许空密码
  MYSQL_DATABASE: getEnv('MYSQL_DATABASE', 'MySQL 数据库名'),
  JWT_SECRET: getEnv('JWT_SECRET', 'JWT 密钥'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', 'JWT 过期时间', '24h'),
}
```

### 在应用启动时使用

```typescript
// src/server.ts
import { loadEnv, printAllEnv } from '@skeleton/shared-utils/env'

// 在应用启动时加载环境变量
const loadedFiles = loadEnv()
console.log('已加载的环境文件:', loadedFiles)

// 开发环境打印所有环境变量
if (process.env.NODE_ENV === 'development') {
  printAllEnv({ maskSensitive: true })
}

// 启动服务器
// ...
```

## 环境变量文件优先级

环境变量加载优先级（从高到低）：

1. **系统环境变量**（最高优先级）
2. `.env` - 基础配置
3. `.env.local` - 本地所有环境通用配置（不提交到版本控制）
4. `.env.${NODE_ENV}` - 环境特定配置（如 `.env.development`）
5. `.env.${NODE_ENV}.local` - 本地开发环境特定配置（不提交到版本控制）

**注意**：后加载的文件会覆盖先加载的文件中的同名变量，但系统环境变量优先级最高。

## 敏感信息处理

`printAllEnv` 默认会隐藏包含以下关键词的环境变量值：
- password
- secret
- key
- token
- auth
- credential

这些变量的值会被显示为 `***`。

## 错误处理

```typescript
import { getEnv } from '@skeleton/shared-utils/env'

try {
  const apiKey = getEnv('API_KEY', 'API 密钥')
} catch (error) {
  // 错误信息格式：
  // Error: 缺少必需的环境变量: API_KEY (API 密钥)
  // 请在 .env 文件中配置此环境变量
  console.error(error.message)
  process.exit(1)
}
```

## 注意事项

1. **仅适用于 Node.js 环境**：此工具使用 `process.env` 和 Node.js 文件系统 API，仅适用于后端项目。

2. **前端项目**：前端项目应使用各自框架的环境变量读取方式：
   - VueAdminSkeleton: `import.meta.env` (Vite)
   - TaroFrontendSkeleton: `process.env` (由 Taro 处理)

3. **dotenv 依赖**：使用 `loadEnv` 功能需要安装 `dotenv` 包。

4. **环境变量文件位置**：默认从 `process.cwd()` 目录查找 `.env` 文件，可以通过 `cwd` 选项指定其他目录。
