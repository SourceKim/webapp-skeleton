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
  id: '1',
  username: 'john',
  email: 'john@example.com',
  created_at: new Date(),
  updated_at: new Date(),
  status: UserStatus.ACTIVE,
  gender: UserGender.MALE
}

// 枚举类型使用
import { UserStatus, MaterialType } from '@skeleton/shared-types'

const status = UserStatus.ACTIVE
const materialType = MaterialType.IMAGE

// 素材类型
import type { Material } from '@skeleton/shared-types'

const material: Material = {
  id: '1',
  type: MaterialType.IMAGE,
  filename: 'example.jpg',
  is_public: true,
  access_count: 0,
  created_at: new Date(),
  updated_at: new Date()
}
```

## 类型定义

### API 相关

- `ApiResponse<T>` - API 响应类型
- `PaginationParams` - 分页请求参数
- `PaginationResponse<T>` - 分页响应数据
- `PaginationQuery` - 分页查询参数（兼容后端）
- `PaginatedResponse<T>` - 分页响应数据（兼容后端）
- `RequestOption` - 请求选项
- `RestResponse<T>` - REST 响应类型
- `PageResult<T>` - 分页结果类型（兼容表格组件）

### 基础类型

- `ID` - 通用 ID 类型（string | number）
- `Timestamp` - 时间戳类型（number | string | Date）
- `BaseEntity` - 通用实体基础字段（包含 id, created_at, updated_at, deleted_at）

### 枚举类型

- `UserStatus` - 用户状态枚举（ACTIVE, INACTIVE, BANNED）
- `UserGender` - 用户性别枚举（MALE, FEMALE, OTHER）
- `MaterialType` - 素材类型枚举（IMAGE, AUDIO, VIDEO, DOCUMENT, TEXT, AVATAR, OTHER）

### 业务类型

#### 用户相关
- `User` - 用户实体接口
- `Role` - 角色实体接口
- `Permission` - 权限实体接口

#### 素材相关
- `Material` - 素材实体接口
- `MaterialCategory` - 素材分类实体接口
- `MaterialTag` - 素材标签实体接口

## 开发

```bash
# 构建
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```
