# VueAdminSkeleton 中使用 @skeleton/shared-types

## 概述

VueAdminSkeleton 项目已更新为使用 `@skeleton/shared-types` 包中的统一类型定义，实现前后端类型统一。

## 已更新的文件

### 1. API 通用类型 (`src/api/types/common.ts`)

**之前：** 自定义定义 `ApiResponse`, `PaginationQuery` 等类型

**现在：** 从 `@skeleton/shared-types` 导入并重新导出

```typescript
import type {
  ApiResponse,
  PaginationQuery,
  PaginatedResponse,
  RequestOption,
  RestResponse,
  PageResult,
  FetchPageDataFun,
  BaseEntity
} from '@skeleton/shared-types';

// 重新导出供项目使用
export type {
  ApiResponse,
  PaginationQuery,
  PaginatedResponse,
  RequestOption,
  RestResponse,
  PageResult,
  FetchPageDataFun
};

// BaseModel 作为 BaseEntity 的别名，保持向后兼容
export type BaseModel = BaseEntity;
```

### 2. 用户相关类型 (`src/api/types/user.ts`)

**之前：** 自定义定义 `User`, `Role`, `Permission`, `UserStatus` 等

**现在：** 从 `@skeleton/shared-types` 导入

```typescript
import type {
  User,
  Role,
  Permission,
  UserStatus,
  UserGender
} from '@skeleton/shared-types';

// 重新导出供项目使用
export type { UserStatus, UserGender, User, Role, Permission };
```

### 3. 素材相关类型

#### `src/api/types/material.ts`
```typescript
export type {
  Material,
  MaterialCategory,
  MaterialTag,
  MaterialType
} from '@skeleton/shared-types';
```

#### `src/api/material/material.d.ts`
```typescript
import type {
  Material as IMaterial,
  MaterialType
} from '@skeleton/shared-types';

// 扩展 Material 接口，添加前端特定的字段
export interface Material extends IMaterial {
  url?: string;
  // 兼容旧字段名
  originalname?: string;
  path?: string;
  // ...
}
```

### 4. 其他类型定义文件

- `src/api/user/user.d.ts` - 使用 shared-types 的 User
- `src/api/user/role.d.ts` - 使用 shared-types 的 Role
- `src/api/user/permission.d.ts` - 使用 shared-types 的 Permission
- `src/api/material/material-category.d.ts` - 使用 shared-types 的 MaterialCategory
- `src/api/material/material-tags.d.ts` - 使用 shared-types 的 MaterialTag

## 使用方式

### 导入类型

```typescript
// 从项目内部的 types 导入（推荐）
import type { User, UserStatus } from '@/api/types/user';
import type { Material, MaterialType } from '@/api/types/material';
import type { ApiResponse, PaginatedResponse } from '@/api/types/common';

// 或直接从 shared-types 导入
import type { User, Material } from '@skeleton/shared-types';
```

### 使用枚举

```typescript
import { UserStatus, MaterialType } from '@skeleton/shared-types';

// 或从项目内部导入
import { UserStatus } from '@/api/types/user';
import { MaterialType } from '@/api/types/material';

const status = UserStatus.ACTIVE;
const materialType = MaterialType.IMAGE;
```

### API 响应类型

```typescript
import type { ApiResponse, PaginatedResponse } from '@/api/types/common';
import type { User } from '@/api/types/user';

// API 响应
const response: ApiResponse<User> = await getUserInfo();

// 分页响应
const listResponse: ApiResponse<PaginatedResponse<Material>> = await getMaterials();
```

## 类型扩展

如果需要在 shared-types 的基础上扩展类型，可以使用接口继承：

```typescript
import type { Material } from '@skeleton/shared-types';

// 扩展 Material 接口，添加前端特定字段
export interface MaterialWithUrl extends Material {
  url?: string;
  thumbnailUrl?: string;
}
```

## 注意事项

1. **字段命名**：shared-types 使用下划线命名（`created_at`, `updated_at`），与后端保持一致
2. **类型兼容性**：所有 DTO（请求/响应参数）类型保持不变，只更新了实体类型
3. **向后兼容**：保留了 `BaseModel` 作为 `BaseEntity` 的别名，现有代码无需修改
4. **枚举值**：枚举值在运行时是 JavaScript 对象，可以正常使用

## 迁移检查清单

- [x] 更新 `src/api/types/common.ts` 使用 shared-types 的 API 类型
- [x] 更新 `src/api/types/user.ts` 使用 shared-types 的用户类型
- [x] 更新 `src/api/types/material.ts` 使用 shared-types 的素材类型
- [x] 更新所有 `.d.ts` 文件使用 shared-types 的类型
- [x] 验证类型检查通过
- [x] 保持 DTO 类型不变（前端特定的请求/响应类型）

## 优势

✅ **类型统一**：前后端使用相同的类型定义  
✅ **减少重复**：避免重复定义相同的类型  
✅ **易于维护**：修改类型定义只需更新 shared-types  
✅ **类型安全**：TypeScript 编译时检查，减少运行时错误  
✅ **向后兼容**：现有代码无需大量修改
