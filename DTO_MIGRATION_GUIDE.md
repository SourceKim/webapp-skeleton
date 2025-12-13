# DTO 迁移指南

## 已完成的工作

### 1. Shared-Types 中的响应 DTO（使用驼峰命名）

已在 `packages/shared-types` 中创建了以下响应 DTO：

- ✅ `PermissionResponseDto`
- ✅ `RoleResponseDto`
- ✅ `UserResponseDto`
- ✅ `MaterialResponseDto`
- ✅ `MaterialCategoryResponseDto`
- ✅ `MaterialTagResponseDto`
- ✅ `ProductSpuResponseDto`
- ✅ `ProductSkuResponseDto`
- ✅ `ProductCategoryResponseDto`
- ✅ `ProductBrandResponseDto`
- ✅ `ProductAttributeKeyResponseDto`
- ✅ `ProductAttributeValueResponseDto`
- ✅ `CarouselResponseDto`
- ✅ `ShopIntroResponseDto`
- ✅ `ShopIntroBannerResponseDto`
- ✅ `CartItemDto`
- ✅ `OrderResponseDto`
- ✅ `UserAddressResponseDto`

### 2. 通用转换工具

创建了 `ExpressBackendSkeleton/src/utils/dto-transform.util.ts`：
- `transformToCamelCase<T>(obj: T): any` - 通用转换函数，将下划线命名转换为驼峰命名

### 3. 已迁移的模块

- ✅ **carousel** - 已完成迁移
- ✅ **user** - 已完成迁移

## 待迁移的模块

需要按照以下步骤迁移每个模块：

### 步骤 1: 更新 Service

1. 移除 `plainToInstance` 导入
2. 添加 `transformToCamelCase` 导入
3. 将返回类型从 `XXXDTO` 改为 `XXXResponseDto`
4. 将所有 `plainToInstance(XXXDTO, entity)` 替换为 `transformToCamelCase(entity) as unknown as XXXResponseDto`

示例：
```typescript
// 之前
import { RoleDTO } from './role.dto';
import { plainToInstance } from 'class-transformer';
return plainToInstance(RoleDTO, role);

// 之后
import type { RoleResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
return transformToCamelCase(role) as unknown as RoleResponseDto;
```

### 步骤 2: 更新 Controller

1. 移除 `XXXDTO` 导入
2. 添加 `XXXResponseDto` 类型导入（从 `@skeleton/shared-types`）
3. 将所有 `Response<ApiResponse<XXXDTO>>` 替换为 `Response<ApiResponse<XXXResponseDto>>`

示例：
```typescript
// 之前
import { RoleDTO } from './role.dto';
res: Response<ApiResponse<RoleDTO>>

// 之后
import type { RoleResponseDto } from '@skeleton/shared-types';
res: Response<ApiResponse<RoleResponseDto>>
```

### 步骤 3: 删除或更新 DTO 文件

将旧的 DTO 文件内容替换为注释说明，参考 `carousel.dto.ts` 的模式。

## 待迁移模块列表

- [ ] **role** - `role.dto.ts`, `role.service.ts`, `role.controller.ts`
- [ ] **permission** - `permission.dto.ts`, `permission.service.ts`, `permission.controller.ts`
- [ ] **material** - `material.dto.ts`, `material.service.ts`, `material.controller.ts`
- [ ] **material-category** - `material-category.dto.ts`, `material-category.service.ts`, `material-category.controller.ts`
- [ ] **material-tag** - `material-tag.dto.ts`, `material-tag.service.ts`, `material-tag.controller.ts`
- [ ] **product/spu** - `product-spu.dto.ts`, `product-spu.service.ts`, `product-spu.controller.ts`
- [ ] **product/sku** - `product-sku.dto.ts`, `product-sku.service.ts`, `product-sku.controller.ts`
- [ ] **product/category** - `product-category.dto.ts`, `product-category.service.ts`, `product-category.controller.ts`
- [ ] **product/brand** - `product-brand.dto.ts`, `product-brand.service.ts`, `product-brand.controller.ts`
- [ ] **product/attribute** - `product-attribute.dto.ts`, `product-attribute.service.ts`, `product-attribute.controller.ts`
- [ ] **mall/cart** - `cart.dto.ts`, `cart.service.ts`, `cart.controller.ts`
- [ ] **mall/shop-intro** - `shop-intro.dto.ts`, `shop-intro.service.ts`, `shop-intro.controller.ts`
- [ ] **mall/order** - `order.dto.ts`, `order.service.ts`, `order.controller.ts`
- [ ] **user/address** - `user-address.dto.ts`, `user-address.service.ts`, `user-address.controller.ts`

## 注意事项

1. 确保在更新前重新构建 `shared-types` 包：`cd packages/shared-types && npm run build`
2. 某些 DTO 可能包含 `@Transform` 装饰器（如状态转换），这些需要在转换函数中处理，或者在前端处理
3. 嵌套对象的转换会自动处理（递归转换）
4. Date 对象会被保留原样
