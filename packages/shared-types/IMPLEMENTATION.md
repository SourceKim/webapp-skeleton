# 数据模型类型统一实现总结

## 实现方案

### 方案概述

采用 **接口分离 + 实现模式**：

1. **shared-types 包**：定义纯 TypeScript 接口和枚举（无 TypeORM 依赖）
2. **后端模型类**：实现 shared-types 中的接口，保留 TypeORM 装饰器
3. **前端项目**：直接使用 shared-types 中的类型定义

### 优势

- ✅ **前后端统一**：单一数据源，避免类型不一致
- ✅ **类型安全**：TypeScript 编译时检查，减少运行时错误
- ✅ **易于维护**：修改类型定义只需更新一处
- ✅ **向后兼容**：后端可以重新导出枚举，保持现有代码可用
- ✅ **无运行时开销**：类型定义在编译时被移除，不影响运行时性能

## 已完成的类型提取

### 1. 基础类型 (`src/base.ts`)

```typescript
export interface BaseEntity {
  id: ID
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at?: Timestamp | null
}
```

### 2. 枚举类型 (`src/enums.ts`)

- `UserStatus` - 用户状态
- `UserGender` - 用户性别  
- `MaterialType` - 素材类型

### 3. 用户相关 (`src/user.ts`)

- `User` - 用户实体
- `Role` - 角色实体
- `Permission` - 权限实体

### 4. 素材相关 (`src/material.ts`)

- `Material` - 素材实体
- `MaterialCategory` - 素材分类
- `MaterialTag` - 素材标签

### 5. API 相关 (`src/api.ts`)

- `ApiResponse<T>` - API 响应
- `PaginationParams` - 分页参数
- `PaginationResponse<T>` - 分页响应
- 以及其他 API 相关类型

## 后端更新

### 更新的文件

1. `ExpressBackendSkeleton/src/modules/common/base.model.ts`
   - 实现 `BaseEntity` 接口

2. `ExpressBackendSkeleton/src/modules/user/user.model.ts`
   - 实现 `User` 接口
   - 从 shared-types 导入枚举

3. `ExpressBackendSkeleton/src/modules/role/role.model.ts`
   - 实现 `Role` 接口

4. `ExpressBackendSkeleton/src/modules/permission/permission.model.ts`
   - 实现 `Permission` 接口

5. `ExpressBackendSkeleton/src/modules/material/material.model.ts`
   - 实现 `Material` 接口
   - 从 shared-types 导入枚举

6. `ExpressBackendSkeleton/src/modules/material/mateial-category/material-category.model.ts`
   - 实现 `MaterialCategory` 接口

7. `ExpressBackendSkeleton/src/modules/material/mateial-tag/material-tag.model.ts`
   - 实现 `MaterialTag` 接口

### 实现模式

```typescript
// 导入类型和枚举
import { UserStatus, UserGender, type User as IUser } from '@skeleton/shared-types';
import { BaseEntity } from '@/modules/common/base.model';

// 重新导出枚举（保持向后兼容）
export { UserStatus, UserGender };

// 实现接口
@Entity('users')
export class User extends BaseEntity implements IUser {
  // TypeORM 装饰器和字段定义
  @Column({ type: 'varchar', length: 100 })
  username!: string;
  // ...
}
```

## 文件结构

```
packages/shared-types/
├── src/
│   ├── base.ts          # 基础类型
│   ├── enums.ts         # 枚举类型
│   ├── user.ts          # 用户相关类型
│   ├── material.ts      # 素材相关类型
│   ├── api.ts           # API 相关类型
│   └── index.ts         # 统一导出
├── dist/                # 编译输出
├── README.md            # 使用文档
├── MIGRATION.md         # 迁移指南
└── IMPLEMENTATION.md    # 实现总结（本文件）
```

## 使用示例

### 后端使用

```typescript
import { UserStatus, type User } from '@skeleton/shared-types';
import { User as UserEntity } from '@/modules/user/user.model';

// 类型检查
const user: User = userEntity;
const status: UserStatus = UserStatus.ACTIVE;
```

### 前端使用

```typescript
import type { User, UserStatus, Material } from '@skeleton/shared-types';
import type { ApiResponse, PaginationResponse } from '@skeleton/shared-types';

// API 响应类型
const response: ApiResponse<User> = await fetchUser();

// 分页响应类型
const listResponse: ApiResponse<PaginationResponse<Material>> = await fetchMaterials();
```

## 验证结果

✅ **构建成功**：`shared-types` 包可以正常构建  
✅ **类型检查通过**：后端模型类正确实现接口  
✅ **向后兼容**：枚举重新导出，现有代码无需修改  
✅ **文档完整**：README 和迁移指南已更新

## 后续建议

### 短期（已完成核心模型）

1. ✅ 基础类型和枚举
2. ✅ 用户、角色、权限模型
3. ✅ 素材相关模型

### 中期（建议继续提取）

1. **商品相关模型**
   - ProductSpu, ProductSku
   - ProductCategory, ProductBrand
   - ProductAttribute 相关

2. **商城相关模型**
   - MallOrder, MallOrderItem
   - Cart
   - UserAddress

3. **其他模型**
   - Carousel
   - ShopIntro

### 长期（优化建议）

1. **类型转换工具**
   - 创建工具函数处理 API 响应到类型的转换
   - 处理字段命名差异（驼峰 vs 下划线）

2. **类型生成工具**
   - 考虑从数据库 Schema 自动生成类型定义
   - 或从 OpenAPI/Swagger 规范生成类型

3. **类型验证**
   - 运行时类型验证（使用 zod
   - API 请求/响应类型验证中间件

## 注意事项

1. **字段命名**：`shared-types` 使用下划线命名（`created_at`），与数据库字段一致
2. **关联关系**：接口中的关联字段（如 `roles?: Role[]`）在前端使用时可能是可选的
3. **枚举导出**：后端重新导出枚举以保持向后兼容，但建议前端直接使用 shared-types
4. **类型扩展**：前端可以扩展接口添加额外字段，但应保持基础字段一致

## 总结

通过本次实现，我们成功将核心数据模型提取到 `@skeleton/shared-types` 包中，实现了前后端类型统一。这为项目的长期维护和扩展奠定了良好的基础。
