/**
 * 商品相关 DTO 类型定义
 */
import type { ProductSpu, ProductSku, ProductCategory, ProductBrand } from './index'
import type { ProductSpuStatus, ProductSkuStatus, ProductCategoryStatus, ProductBrandStatus } from './enums'
import type { Material } from '../material'

/**
 * 创建商品SPU请求参数
 */
export interface CreateProductSpuDto {
  name: string
  sub_title?: string
  description?: string
  category_id?: string
  brand_id?: string
  status?: ProductSpuStatus
  main_material_id?: string
  sub_material_ids?: string[]
  detail_content?: string
}

/**
 * 更新商品SPU请求参数
 */
export interface UpdateProductSpuDto {
  name?: string
  sub_title?: string
  description?: string
  category_id?: string
  brand_id?: string
  status?: ProductSpuStatus
  main_material_id?: string
  sub_material_ids?: string[]
  detail_content?: string
}

/**
 * 商品SPU查询参数
 */
export interface ProductSpuQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  name?: string
  category_id?: string
  brand_id?: string
  status?: ProductSpuStatus
}

/**
 * 商品SPU响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ProductSpuResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  name: string
  subTitle?: string
  description?: string
  categoryId?: string | null
  category?: ProductCategory
  brandId?: string | null
  brand?: ProductBrand
  status: ProductSpuStatus
  mainMaterialId?: string | null
  mainMaterial?: Material | null
  subMaterials?: Material[] | null
  detailContent?: string | null
  price?: string // 最低价格
}

/**
 * 创建商品SKU请求参数
 */
export interface CreateProductSkuDto {
  spu_id: string
  sku_code: string
  sku_name?: string
  price: string
  original_price?: string
  cost_price?: string
  stock: number
  status?: ProductSkuStatus
  is_default?: boolean
  attribute_ids?: Array<{ key_id: string; value_id: string }> // 属性关联
}

/**
 * 更新商品SKU请求参数
 */
export interface UpdateProductSkuDto {
  sku_code?: string
  sku_name?: string
  price?: string
  original_price?: string | null
  cost_price?: string | null
  stock?: number
  status?: ProductSkuStatus
  is_default?: boolean
}

/**
 * 更新SKU价格请求参数
 */
export interface UpdateSkuPriceDto {
  price: string
}

/**
 * 更新SKU库存请求参数
 */
export interface UpdateSkuStockDto {
  stock: number
}

/**
 * 更新SKU状态请求参数
 */
export interface UpdateSkuStatusDto {
  status: ProductSkuStatus
}

/**
 * 商品SKU查询参数
 */
export interface ProductSkuQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  spu_id?: string
  sku_code?: string
  status?: ProductSkuStatus
}

/**
 * 商品SKU响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ProductSkuResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  spuId: string
  skuCode: string
  skuName?: string
  price: string
  originalPrice?: string
  costPrice?: string
  stock: number
  status: ProductSkuStatus
  isDefault: boolean
  attributes?: Array<{ keyId: string; valueId: string; keyName?: string; value?: string }>
}

/**
 * 创建商品分类请求参数
 */
export interface CreateProductCategoryDto {
  name: string
  description?: string
  parent_id?: string
  material_id?: string
  brand_id?: string
  status?: ProductCategoryStatus
}

/**
 * 更新商品分类请求参数
 */
export interface UpdateProductCategoryDto {
  name?: string
  description?: string
  parent_id?: string
  material_id?: string
  brand_id?: string
  status?: ProductCategoryStatus
}

/**
 * 商品分类查询参数
 */
export interface ProductCategoryQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  name?: string
  parent_id?: string
  status?: ProductCategoryStatus
}

/**
 * 商品分类响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ProductCategoryResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  name: string
  description?: string
  parentId?: string
  level: number
  materialId?: string
  material?: Material
  brandId?: string
  brandName?: string
  status: ProductCategoryStatus
}

/**
 * 创建商品品牌请求参数
 */
export interface CreateProductBrandDto {
  name: string
  description?: string
  logo_id?: string
  material_id?: string
  website?: string
  status?: ProductBrandStatus
}

/**
 * 更新商品品牌请求参数
 */
export interface UpdateProductBrandDto {
  name?: string
  description?: string
  logo_id?: string
  material_id?: string
  website?: string
  status?: ProductBrandStatus
}

/**
 * 商品品牌查询参数
 */
export interface ProductBrandQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  name?: string
  status?: ProductBrandStatus
}

/**
 * 商品品牌响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ProductBrandResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  name: string
  description?: string
  materialId?: string
  website?: string
  status: ProductBrandStatus
  logo?: Material
}

/**
 * 创建商品属性键请求参数
 */
export interface CreateProductAttributeKeyDto {
  spu_id: string
  name: string
  key?: string
  required?: boolean
}

/**
 * 更新商品属性键请求参数
 */
export interface UpdateProductAttributeKeyDto {
  name?: string
  key?: string
  required?: boolean
}

/**
 * 创建商品属性值请求参数
 */
export interface CreateProductAttributeValueDto {
  attribute_key_id: string
  value: string
  value_id?: string
  image_id?: string
}

/**
 * 更新商品属性值请求参数
 */
export interface UpdateProductAttributeValueDto {
  value?: string
  value_id?: string
  image_id?: string | null
}

/**
 * 商品属性键响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ProductAttributeKeyResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  spuId: string
  name: string
  key: string
  required: boolean
}

/**
 * 商品属性值响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ProductAttributeValueResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  attributeKeyId: string
  value: string
  valueId: string
  imageId?: string
}
