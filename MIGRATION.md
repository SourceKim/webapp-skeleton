# 迁移指南：使用共享包

本文档说明如何将现有代码迁移到使用共享包。

## 迁移步骤

### 1. 安装依赖

在根目录运行：

```bash
pnpm install
```

这会安装所有项目的依赖，包括共享包。

### 2. 构建共享包

```bash
pnpm build:shared
```

### 3. 迁移环境变量工具（ExpressBackendSkeleton）

#### 迁移前

```typescript
// src/configs/env.config.ts
export function getEnv(key: string, description?: string, allowEmpty: boolean = false): string {
  const value = process.env[key]
  // ... 实现
}
```

#### 迁移后

```typescript
// src/configs/env.config.ts
import { getEnv, getEnvOptional, getEnvNumber, getEnvArray } from '@skeleton/shared-utils/env'

// 直接使用共享包的工具函数
export const ENV = {
  PORT: getEnvNumber('PORT', '服务器端口号', 3000),
  NODE_ENV: getEnv('NODE_ENV', '运行环境'),
  // ...
}
```

### 4. 迁移验证工具（VueAdminSkeleton）

#### 迁移前

```typescript
// src/components/utils/validation-core.ts
import { validateRequired, validateType } from './validation-rules'
// ... 使用本地验证函数
```

#### 迁移后

```typescript
// 直接使用共享包的验证工具
import { validate, FieldRule, datatype } from '@skeleton/shared-utils/validation'

const rules: FieldRule[] = [
  {
    prop: 'username',
    rules: [
      { required: true, message: '用户名不能为空' },
      { pattern: datatype.mobile, message: '必须是手机号格式' }
    ]
  }
]

const result = await validate(formData, rules)
```

### 5. 迁移类型定义

#### 迁移前

```typescript
// 各个项目中重复定义
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}
```

#### 迁移后

```typescript
// 统一使用共享类型
import type { ApiResponse, PaginationResponse, User } from '@skeleton/shared-types'

function getUser(): Promise<ApiResponse<User>> {
  // ...
}
```

## 具体迁移示例

### ExpressBackendSkeleton 迁移示例

#### 步骤 1：更新 env.config.ts

```typescript
// src/configs/env.config.ts
import { 
  getEnv, 
  getEnvOptional, 
  getEnvNumber, 
  getEnvArray 
} from '@skeleton/shared-utils/env'

// 删除本地的 getEnv 和 getEnvOptional 函数实现
// 直接使用共享包的函数

export const ENV = {
  NODE_ENV: getEnv('NODE_ENV', '运行环境'),
  PORT: getEnvNumber('PORT', '服务器端口号', 3000),
  MYSQL_HOST: getEnv('MYSQL_HOST', 'MySQL 主机地址'),
  MYSQL_PORT: getEnvNumber('MYSQL_PORT', 'MySQL 端口号', 3306),
  // ... 其他配置
}
```

#### 步骤 2：更新 API 响应类型

```typescript
// src/types/api.d.ts
import type { ApiResponse, PaginationResponse } from '@skeleton/shared-types'

// 删除本地定义，使用共享类型
export type { ApiResponse, PaginationResponse }
```

### VueAdminSkeleton 迁移示例

#### 步骤 1：更新验证工具使用

```typescript
// src/components/utils/validation-core.ts
// 可以保留作为包装，或者直接替换为共享包

// 方案 A：直接替换
import { validate, FieldRule } from '@skeleton/shared-utils/validation'
export { validate, FieldRule }

// 方案 B：保留包装以保持向后兼容
import { validate as sharedValidate, FieldRule } from '@skeleton/shared-utils/validation'
export { FieldRule }
export { sharedValidate as validate }
```

#### 步骤 2：更新类型定义

```typescript
// src/api/types/common.ts
import type { ApiResponse, PaginationResponse } from '@skeleton/shared-types'

// 删除本地定义，使用共享类型
export type { ApiResponse, PaginationResponse }
```

### TaroFrontendSkeleton 迁移示例

#### 步骤 1：更新类型定义

```typescript
// src/types/index.ts
import type { ApiResponse, User } from '@skeleton/shared-types'

// 使用共享类型
export type { ApiResponse, User }
```

#### 步骤 2：使用验证工具（如果需要）

```typescript
// src/utils/validate.ts
import { validate, FieldRule, datatype } from '@skeleton/shared-utils/validation'

// 使用共享包的验证工具
export { validate, FieldRule, datatype }
```

## 注意事项

1. **环境变量工具**：`@skeleton/shared-utils/env` 中的函数使用 `process.env`，仅适用于 Node.js 环境。前端项目应继续使用各自的环境变量读取方式：
   - VueAdminSkeleton: `import.meta.env`
   - TaroFrontendSkeleton: `process.env` (由 Taro 处理)

2. **逐步迁移**：不需要一次性迁移所有代码，可以逐步迁移：
   - 先迁移类型定义（影响最小）
   - 再迁移工具函数
   - 最后清理重复代码

3. **向后兼容**：如果项目中有很多地方使用了旧的导入路径，可以先创建包装文件，逐步迁移。

4. **测试**：迁移后务必测试相关功能，确保正常工作。

## 验证迁移

迁移完成后，运行以下命令验证：

```bash
# 构建共享包
pnpm build:shared

# 构建各个项目
pnpm build:backend
pnpm build:admin
pnpm build:taro

# 运行测试（如果有）
pnpm test
```

## 回滚

如果迁移出现问题，可以：

1. 恢复 git 提交
2. 或者移除共享包依赖，恢复原来的本地实现

```bash
# 移除共享包依赖
# 编辑各项目的 package.json，删除 @skeleton/* 依赖
# 恢复原来的代码实现
```
