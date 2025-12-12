# 共享包说明

本目录包含 Skeleton 项目的共享包，供各个子项目使用。

## 包列表

### @skeleton/shared-utils

共享工具函数库，包含：

- **环境变量工具** (`env`) - 适用于 Node.js 环境的环境变量读取工具
- **验证工具** (`validation`) - 通用的表单验证工具函数

#### 使用示例

```typescript
// 环境变量工具（Node.js 环境）
import { getEnv, getEnvOptional, getEnvNumber } from '@skeleton/shared-utils/env'

const port = getEnvNumber('PORT', '服务器端口号', 3000)
const apiKey = getEnvOptional('API_KEY')

// 验证工具
import { validate, FieldRule, datatype } from '@skeleton/shared-utils/validation'

const rules: FieldRule[] = [
  {
    prop: 'username',
    rules: [
      { required: true, message: '用户名不能为空' },
      { minLength: 3, maxLength: 20, message: '用户名长度必须在 3-20 个字符之间' }
    ]
  },
  {
    prop: 'email',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { pattern: datatype.email, message: '邮箱格式不正确' }
    ]
  }
]

const result = await validate(formData, rules)
if (!result.success) {
  console.error(result.errFields)
}
```

### @skeleton/shared-types

共享 TypeScript 类型定义库，包含：

- API 响应类型
- 分页相关类型
- 用户、角色、权限等实体类型
- 通用基础类型

#### 使用示例

```typescript
import type { ApiResponse, PaginationResponse, User, BaseEntity } from '@skeleton/shared-types'

// API 响应
const response: ApiResponse<User> = {
  code: 200,
  data: {
    id: 1,
    username: 'admin',
    email: 'admin@example.com'
  },
  message: 'success'
}

// 分页响应
const paginationResponse: PaginationResponse<User> = {
  list: [],
  total: 100,
  page: 1,
  pageSize: 10
}
```

## 开发指南

### 添加新的共享工具函数

1. 在 `packages/shared-utils/src` 目录下创建新文件或添加到现有文件
2. 在 `packages/shared-utils/src/index.ts` 中导出
3. 如果需要单独导出，在 `tsup.config.ts` 中添加入口
4. 构建：`pnpm build`

### 添加新的类型定义

1. 在 `packages/shared-types/src` 目录下创建新文件或添加到现有文件
2. 在 `packages/shared-types/src/index.ts` 中导出
3. 构建：`pnpm build`

### 构建

```bash
# 构建所有共享包
pnpm build:shared

# 构建单个包
cd packages/shared-utils
pnpm build
```

### 开发模式（watch）

```bash
# 监听模式构建
cd packages/shared-utils
pnpm dev
```

## 注意事项

1. **环境差异**：`@skeleton/shared-utils/env` 中的 `getEnv` 函数使用 `process.env`，仅适用于 Node.js 环境。前端项目应使用各自框架的环境变量读取方式（Vite 的 `import.meta.env`、Taro 的 `process.env` 等）。

2. **构建顺序**：修改共享包代码后，需要重新构建才能在项目中使用。建议在开发时使用 watch 模式。

3. **类型安全**：共享包提供完整的 TypeScript 类型定义，确保类型安全。

4. **版本管理**：使用 `workspace:*` 协议，始终使用本地最新版本。
