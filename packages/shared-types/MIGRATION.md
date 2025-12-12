# 数据模型类型统一迁移指南

## 概述

本项目已将后端数据模型提取到 `@skeleton/shared-types` 包中，实现前后端类型统一。

## 已完成的工作

### 1. 基础类型 (`base.ts`)
- `BaseEntity` - 通用实体基础字段（id, created_at, updated_at, deleted_at）
- `ID` - 通用 ID 类型
- `Timestamp` - 时间戳类型

### 2. 枚举类型 (`enums.ts`)
- `UserStatus` - 用户状态枚举
- `UserGender` - 用户性别枚举
- `MaterialType` - 素材类型枚举

### 3. 用户相关类型 (`user.ts`)
- `User` - 用户实体接口
- `Role` - 角色实体接口
- `Permission` - 权限实体接口

### 4. 素材相关类型 (`material.ts`)
- `Material` - 素材实体接口
- `MaterialCategory` - 素材分类实体接口
- `MaterialTag` - 素材标签实体接口

### 5. API 相关类型 (`api.ts`)
- `ApiResponse<T>` - API 响应类型
- `PaginationParams` - 分页请求参数
- `PaginationResponse<T>` - 分页响应数据
- 以及其他 API 相关类型

## 后端使用方式

### 模型类实现接口

后端模型类现在实现了 `shared-types` 中的接口，确保类型一致性：

```typescript
// ExpressBackendSkeleton/src/modules/user/user.model.ts
import { UserStatus, UserGender, type User as IUser } from '@skeleton/shared-types';
import { BaseEntity } from '@/modules/common/base.model';

@Entity('users')
export class User extends BaseEntity implements IUser {
  // ... TypeORM 装饰器和字段定义
}
```

### 枚举使用

```typescript
// 从 shared-types 导入枚举
import { UserStatus, MaterialType } from '@skeleton/shared-types';

// 后端仍然可以重新导出枚举以保持向后兼容
export { UserStatus, UserGender };
```

## 前端使用方式

### Vue Admin 项目

```typescript
// VueAdminSkeleton/src/api/user/user.d.ts
import type { User, UserStatus, UserGender } from '@skeleton/shared-types';

// 使用统一的类型定义
export interface UserResponse extends User {
  // 可以扩展额外的字段
}

// API 响应类型
import type { ApiResponse, PaginationResponse } from '@skeleton/shared-types';

export type UserListResponse = ApiResponse<PaginationResponse<User>>;
```

### Taro 前端项目

```typescript
// TaroFrontendSkeleton/src/services/user.ts
import type { User, UserStatus } from '@skeleton/shared-types';
import type { ApiResponse } from '@skeleton/shared-types';

// 使用统一的类型
export const getUserInfo = async (): Promise<ApiResponse<User>> => {
  // ...
};
```

## 迁移步骤

### 步骤 1: 更新导入语句

**之前：**
```typescript
// 前端项目中的类型定义
interface User {
  id: string;
  username: string;
  // ...
}
```

**之后：**
```typescript
// 从 shared-types 导入
import type { User } from '@skeleton/shared-types';
```

### 步骤 2: 更新枚举使用

**之前：**
```typescript
// 前端项目中定义的枚举
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}
```

**之后：**
```typescript
// 从 shared-types 导入
import { UserStatus } from '@skeleton/shared-types';
```

### 步骤 3: 更新 API 响应类型

**之前：**
```typescript
interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}
```

**之后：**
```typescript
import type { ApiResponse } from '@skeleton/shared-types';
```

## 注意事项

### 1. 字段命名差异

`shared-types` 中的 `BaseEntity` 使用下划线命名（`created_at`, `updated_at`），与后端数据库字段保持一致。

前端使用时，如果 API 返回的是驼峰命名，可能需要类型转换：

```typescript
// API 返回的数据
interface ApiUser {
  createdAt: string;
  updatedAt: string;
}

// 转换为 shared-types 类型
const user: User = {
  ...apiUser,
  created_at: apiUser.createdAt,
  updated_at: apiUser.updatedAt,
};
```

### 2. 关联关系

`shared-types` 中的接口包含关联关系字段（如 `roles?: Role[]`），这些字段在前端使用时可能是可选的，取决于 API 返回的数据结构。

### 3. 密码字段

`User` 接口中的 `password` 字段是可选的，前端通常不需要使用此字段。

## 后续工作

### 待提取的模型类型

以下模型类型可以继续提取到 `shared-types`：

1. **商品相关**
   - `ProductSpu` - 商品 SPU
   - `ProductSku` - 商品 SKU
   - `ProductCategory` - 商品分类
   - `ProductBrand` - 商品品牌

2. **商城相关**
   - `MallOrder` - 订单
   - `MallOrderItem` - 订单项
   - `Cart` - 购物车

3. **其他**
   - `UserAddress` - 用户地址
   - `Carousel` - 轮播图
   - `ShopIntro` - 店铺介绍

### 提取新模型的步骤

1. 在 `shared-types/src` 中创建对应的类型文件
2. 定义接口和枚举
3. 在 `index.ts` 中导出
4. 更新后端模型类，实现接口
5. 更新前端项目，使用新类型
6. 更新文档

## 验证

### 构建检查

```bash
# 构建 shared-types
pnpm --filter @skeleton/shared-types build

# 构建所有共享包
pnpm build:shared
```

### 类型检查

确保后端和前端项目都能正确导入和使用这些类型：

```typescript
// 类型检查示例
import type { User, Material, UserStatus } from '@skeleton/shared-types';

const user: User = {
  id: '1',
  username: 'test',
  created_at: new Date(),
  updated_at: new Date(),
  status: UserStatus.ACTIVE,
  gender: UserGender.MALE,
};
```

## 总结

通过将数据模型提取到 `@skeleton/shared-types`，我们实现了：

✅ 前后端类型统一  
✅ 类型定义单一数据源  
✅ 更好的类型安全性  
✅ 减少重复代码  
✅ 便于维护和更新
