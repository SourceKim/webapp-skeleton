# Monorepo 快速开始指南

## 概述

本项目已配置为 Monorepo 结构，使用 **pnpm workspaces** 管理多个包和项目。通过共享包实现代码复用，提高开发效率。

## 目录结构

```
Skeleton/
├── packages/                    # 共享包目录
│   ├── shared-utils/           # 共享工具函数库
│   │   ├── src/
│   │   │   ├── env.ts          # 环境变量工具（Node.js）
│   │   │   ├── validation/     # 验证工具
│   │   │   └── index.ts
│   │   └── package.json
│   └── shared-types/           # 共享类型定义库
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── ExpressBackendSkeleton/     # Express 后端项目
├── VueAdminSkeleton/           # Vue 管理后台项目
├── TaroFrontendSkeleton/       # Taro 前端项目
├── package.json                # 根 package.json
└── pnpm-workspace.yaml         # pnpm workspace 配置
```

## 快速开始

### 1. 安装 pnpm（如果还没有）

```bash
npm install -g pnpm
```

### 2. 安装所有依赖

```bash
# 在根目录运行
pnpm install
```

这会安装所有子项目和共享包的依赖。

### 3. 构建共享包

```bash
# 构建所有共享包
pnpm build:shared
```

### 4. 开发

```bash
# 启动单个项目
pnpm dev:backend   # 启动后端
pnpm dev:admin     # 启动管理后台
pnpm dev:taro      # 启动 Taro H5

# 启动所有项目（并行）
pnpm dev:all
```

### 5. 构建

```bash
# 构建单个项目
pnpm build:backend
pnpm build:admin
pnpm build:taro

# 构建所有项目
pnpm build:all
```

## 使用共享包

### 在 ExpressBackendSkeleton 中使用

```typescript
// 使用环境变量工具
import { getEnv, getEnvOptional, getEnvNumber } from '@skeleton/shared-utils/env'

const port = getEnvNumber('PORT', '服务器端口号', 3000)
const apiKey = getEnvOptional('API_KEY')

// 使用验证工具
import { validate, FieldRule } from '@skeleton/shared-utils/validation'

const rules: FieldRule[] = [
  {
    prop: 'username',
    rules: [{ required: true, message: '用户名不能为空' }]
  }
]

// 使用共享类型
import type { ApiResponse, User } from '@skeleton/shared-types'
```

### 在 VueAdminSkeleton 中使用

```typescript
// 使用验证工具
import { validate, FieldRule, datatype } from '@skeleton/shared-utils/validation'

const rules: FieldRule[] = [
  {
    prop: 'email',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { pattern: datatype.email, message: '邮箱格式不正确' }
    ]
  }
]

// 使用共享类型
import type { ApiResponse, PaginationResponse, User } from '@skeleton/shared-types'
```

### 在 TaroFrontendSkeleton 中使用

```typescript
// 使用验证工具
import { validate, FieldRule } from '@skeleton/shared-utils/validation'

// 使用共享类型
import type { ApiResponse, User } from '@skeleton/shared-types'
```

## 共享包说明

### @skeleton/shared-utils

共享工具函数库：

- **env** - 环境变量工具（适用于 Node.js）
- **validation** - 表单验证工具

### @skeleton/shared-types

共享 TypeScript 类型定义：

- `ApiResponse<T>` - API 响应类型
- `PaginationResponse<T>` - 分页响应类型
- `User` - 用户类型
- `Role` - 角色类型
- `Permission` - 权限类型
- `BaseEntity` - 基础实体类型

## 开发工作流

### 修改共享包

1. 修改共享包代码
2. 构建共享包：`pnpm build:shared`
3. 使用该共享包的项目会自动使用最新版本

### 开发模式（自动构建）

```bash
# 在共享包目录下启动 watch 模式
cd packages/shared-utils
pnpm dev

# 在另一个终端启动项目
pnpm dev:admin
```

## 常见问题

### Q: 修改了共享包代码，为什么项目中没有生效？

A: 需要重新构建共享包：`pnpm build:shared`

### Q: 如何在开发时自动构建共享包？

A: 在共享包目录下运行 `pnpm dev`，这会启动 watch 模式自动构建。

### Q: 前端项目可以使用 env 工具吗？

A: 不可以。`@skeleton/shared-utils/env` 使用 `process.env`，仅适用于 Node.js 环境。前端项目应使用：
- VueAdminSkeleton: `import.meta.env`
- TaroFrontendSkeleton: `process.env` (由 Taro 处理)

### Q: 如何添加新的共享包？

A: 
1. 在 `packages` 目录下创建新包目录
2. 创建 `package.json`，设置 `name` 为 `@skeleton/包名`
3. 在需要使用的项目中添加依赖：`"@skeleton/包名": "workspace:*"`
4. 运行 `pnpm install`

## 更多文档

- [Monorepo 使用指南](./MONOREPO.md) - 详细的 Monorepo 使用说明
- [迁移指南](./MIGRATION.md) - 如何将现有代码迁移到使用共享包
- [共享包说明](./packages/README.md) - 共享包的详细说明
