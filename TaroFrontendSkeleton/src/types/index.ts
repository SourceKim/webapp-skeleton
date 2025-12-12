/**
 * TaroFrontendSkeleton 统一类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */

// 重新导出 shared-types 中的类型
export type {
  // 基础类型
  BaseEntity,
  ID,
  Timestamp,
  
  // 枚举类型
  UserStatus,
  UserGender,
  MaterialType,
  PaymentStatus,
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  UserAddressTag,
  UserAddressStatus,
  ProductSpuStatus,
  ProductSkuStatus,
  ProductCategoryStatus,
  ProductBrandStatus,
  
  // 用户相关类型
  User,
  Role,
  Permission,
  
  // 素材相关类型
  Material,
  MaterialCategory,
  MaterialTag,
  
  // 商城相关类型
  MallOrder,
  MallOrderItem,
  Cart,
  Carousel,
  ShopIntro,
  ShopIntroBanner,
  UserAddress,
  
  // 商品相关类型
  ProductSpu,
  ProductSku,
  ProductCategory,
  ProductBrand,
  ProductAttributeKey,
  ProductAttributeValue,
  ProductSkuAttribute,
  SkuAttributeKV,
  
  // API 相关类型
  ApiResponse,
  PaginationQuery,
  PaginatedResponse,
  RequestOption,
  RestResponse,
  PageResult
} from '@skeleton/shared-types';

// 重新导出枚举值（运行时可用）
export {
  UserStatus,
  UserGender,
  MaterialType,
  PaymentStatus,
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  UserAddressTag,
  UserAddressStatus,
  ProductSpuStatus,
  ProductSkuStatus,
  ProductCategoryStatus,
  ProductBrandStatus
} from '@skeleton/shared-types';

// BaseModel 作为 BaseEntity 的别名，保持向后兼容
export type BaseModel = BaseEntity;
