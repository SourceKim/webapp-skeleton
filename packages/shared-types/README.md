# @skeleton/shared-types

Skeleton 项目共享 TypeScript 类型定义库，提供跨项目使用的通用类型。

## 安装

在 Monorepo 中，此包会自动通过 workspace 协议链接，无需手动安装。

## 使用

```typescript
import type { ApiResponse, PaginationParams, PaginationResponse, User, Role } from '@skeleton/shared-types'

// API 响应类型
const response: ApiResponse<User> = {
  code: 200,
  data: {
    id: 1,
    username: 'john',
    email: 'john@example.com'
  },
  message: 'success'
}

// 分页请求参数
const params: PaginationParams = {
  page: 1,
  pageSize: 10
}

// 分页响应数据
const paginationData: PaginationResponse<User> = {
  list: [/* ... */],
  total: 100,
  page: 1,
  pageSize: 10,
  totalPages: 10
}

// 用户类型
const user: User = {
  id: 1,
  username: 'john',
  email: 'john@example.com',
  createdAt: Date.now(),
  updatedAt: Date.now()
}
```

## 类型定义

### API 相关

- `ApiResponse<T>` - API 响应类型
- `PaginationParams` - 分页请求参数
- `PaginationResponse<T>` - 分页响应数据

### 基础类型

- `ID` - 通用 ID 类型（string | number）
- `Timestamp` - 时间戳类型（number | string | Date）
- `BaseEntity` - 通用实体基础字段

### 业务类型

- `User` - 用户类型
- `Role` - 角色类型
- `Permission` - 权限类型

## 开发

```bash
# 构建
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```
