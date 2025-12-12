# TaroFrontendSkeleton 中使用 @skeleton/shared-types

## 概述

TaroFrontendSkeleton 项目已更新为使用 `@skeleton/shared-types` 包中的统一类型定义，实现前后端类型统一。

## 已更新的文件

### 1. 统一类型定义 (`src/types/index.ts`)

创建了统一的类型定义文件，重新导出 shared-types 中的所有类型：

```typescript
export type {
  BaseEntity,
  UserStatus,
  UserGender,
  MaterialType,
  User,
  Role,
  Permission,
  Material,
  MaterialCategory,
  MaterialTag,
  ApiResponse,
  PaginationQuery,
  PaginatedResponse,
  // ...
} from '@skeleton/shared-types';

// 重新导出枚举值（运行时可用）
export {
  UserStatus,
  UserGender,
  MaterialType
} from '@skeleton/shared-types';
```

### 2. API 服务 (`src/services/api.ts`)

**之前：** 自定义定义 `ApiResponse` 接口

**现在：** 从 `@skeleton/shared-types` 导入

```typescript
import type { ApiResponse } from '@skeleton/shared-types'

// 重新导出供项目使用
export type { ApiResponse }
```

### 3. 用户相关服务

#### `src/services/auth.ts`
- 使用 `User`, `UserGender`, `UserStatus` 从 shared-types
- `UserInfo` 接口扩展 `User`，添加前端特定字段

#### `src/services/user.ts`
- 使用 `UserGender` 枚举

### 4. 素材相关服务 (`src/services/material.ts`)

**之前：** 自定义定义 `Material` 接口和 `MaterialType` 类型

**现在：** 从 `@skeleton/shared-types` 导入并扩展

```typescript
import type { Material as IMaterial, MaterialType } from '@skeleton/shared-types'

// 重新导出枚举
export { MaterialType } from '@skeleton/shared-types';

// 扩展 Material 接口，添加前端特定的字段
export interface Material extends IMaterial {
  originalname?: string
  mimetype?: string
  size?: number
  category?: string
  tags?: string[]
}
```

### 5. 其他服务文件

- `src/services/home.ts` - 使用 `PaginatedResponse` 类型
- `src/services/mall.ts` - 使用 `PaginatedResponse` 类型
- `src/services/product.ts` - 使用 `PaginationQuery` 和 `PaginatedResponse` 类型

## 使用方式

### 导入类型

```typescript
// 方式 1: 从统一的 types/index.ts 导入（推荐）
import type { User, Material, UserStatus, MaterialType } from '@/types'

// 方式 2: 直接从 shared-types 导入
import type { User, Material } from '@skeleton/shared-types'
import { UserStatus, MaterialType } from '@skeleton/shared-types'

// 方式 3: 从各个 service 文件导入（向后兼容）
import type { Material } from '@/services/material'
import type { UserInfo } from '@/services/auth'
```

### 使用枚举

```typescript
import { UserStatus, MaterialType } from '@skeleton/shared-types'

// 或从统一类型文件导入
import { UserStatus, MaterialType } from '@/types'

const status = UserStatus.ACTIVE
const materialType = MaterialType.IMAGE
```

### API 响应类型

```typescript
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types'
import type { Material } from '@/services/material'

// API 响应
const response: ApiResponse<Material> = await getMaterial(id)

// 分页响应
const listResponse: ApiResponse<PaginatedResponse<Material>> = await getMaterials()
```

## 类型扩展

如果需要在 shared-types 的基础上扩展类型，可以使用接口继承：

```typescript
import type { Material } from '@skeleton/shared-types'

// 扩展 Material 接口，添加前端特定字段
export interface Material extends IMaterial {
  url?: string
  thumbnailUrl?: string
  // 兼容旧字段名
  originalname?: string
}
```

## 注意事项

1. **字段命名**：shared-types 使用下划线命名（`created_at`, `updated_at`），与后端保持一致

2. **枚举值**：枚举值在运行时是 JavaScript 对象，可以正常使用：
   ```typescript
   import { UserStatus } from '@skeleton/shared-types'
   const status = UserStatus.ACTIVE // 'active'
   ```

3. **类型兼容性**：
   - 所有 DTO（请求/响应参数）类型保持不变
   - 实体类型已更新为使用 shared-types
   - 前端特定的扩展字段通过接口继承添加

4. **向后兼容**：
   - 保留了原有的导入路径
   - 现有代码可以继续使用原有的类型导入

## 迁移检查清单

- [x] 创建统一的类型定义文件 `src/types/index.ts`
- [x] 更新 `src/services/api.ts` 使用 shared-types 的 ApiResponse
- [x] 更新 `src/services/auth.ts` 使用 shared-types 的用户类型
- [x] 更新 `src/services/user.ts` 使用 shared-types 的用户类型
- [x] 更新 `src/services/material.ts` 使用 shared-types 的素材类型
- [x] 更新其他 services 文件使用 shared-types 的类型
- [x] 保持 DTO 类型不变（前端特定的请求/响应类型）

## 优势

✅ **类型统一**：前后端使用相同的类型定义  
✅ **减少重复**：避免重复定义相同的类型  
✅ **易于维护**：修改类型定义只需更新 shared-types  
✅ **类型安全**：TypeScript 编译时检查，减少运行时错误  
✅ **向后兼容**：现有代码无需大量修改

## 示例

### 使用用户类型

```typescript
import type { User, UserStatus } from '@skeleton/shared-types'
import { UserStatus } from '@skeleton/shared-types'
import type { UserInfo } from '@/services/auth'

const user: UserInfo = {
  id: '1',
  username: 'test',
  status: UserStatus.ACTIVE,
  gender: UserGender.MALE,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}
```

### 使用素材类型

```typescript
import type { Material } from '@/services/material'
import { MaterialType } from '@skeleton/shared-types'

const material: Material = {
  id: '1',
  type: MaterialType.IMAGE,
  filename: 'example.jpg',
  is_public: true,
  access_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}
```
