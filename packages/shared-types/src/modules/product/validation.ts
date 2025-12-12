/**
 * 商品相关验证规则定义
 * 使用 Zod 进行前后端统一的验证
 */

import { z } from 'zod'
import { ProductSpuStatus, ProductSkuStatus, ProductCategoryStatus, ProductBrandStatus } from './enums'

/**
 * 创建商品SPU验证 Schema
 */
export const createProductSpuSchema = z.object({
  name: z.string()
    .min(1, '商品名称不能为空')
    .max(255, '商品名称长度不能超过255个字符'),
  sub_title: z.string()
    .max(500, '副标题长度不能超过500个字符')
    .optional(),
  description: z.string().optional(),
  category_id: z.string()
    .max(36, '分类ID长度不能超过36个字符')
    .optional(),
  brand_id: z.string()
    .max(36, '品牌ID长度不能超过36个字符')
    .optional(),
  status: z.nativeEnum(ProductSpuStatus).optional(),
  main_material_id: z.string()
    .max(36, '主素材ID长度不能超过36个字符')
    .optional(),
  sub_material_ids: z.array(z.string()).optional(),
  detail_content: z.string().optional()
})

/**
 * 更新商品SPU验证 Schema
 */
export const updateProductSpuSchema = createProductSpuSchema.partial()

/**
 * 商品SPU查询参数验证 Schema
 */
export const productSpuQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  name: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  status: z.nativeEnum(ProductSpuStatus).optional()
})

/**
 * 创建商品SKU验证 Schema
 */
export const createProductSkuSchema = z.object({
  spu_id: z.string()
    .min(1, '商品SPU ID不能为空')
    .max(36, '商品SPU ID长度不能超过36个字符'),
  sku_code: z.string()
    .min(1, 'SKU编码不能为空')
    .max(100, 'SKU编码长度不能超过100个字符'),
  sku_name: z.string()
    .max(500, 'SKU名称长度不能超过500个字符')
    .optional(),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '价格格式不正确，应为数字，最多两位小数'),
  original_price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '原价格式不正确，应为数字，最多两位小数')
    .optional(),
  cost_price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '成本价格式不正确，应为数字，最多两位小数')
    .optional(),
  stock: z.number()
    .int('库存必须是整数')
    .min(0, '库存不能为负数'),
  status: z.nativeEnum(ProductSkuStatus).optional(),
  is_default: z.boolean().optional(),
  attribute_ids: z.array(z.object({
    key_id: z.string(),
    value_id: z.string()
  })).optional()
})

/**
 * 更新商品SKU验证 Schema
 */
export const updateProductSkuSchema = z.object({
  sku_code: z.string()
    .max(100, 'SKU编码长度不能超过100个字符')
    .optional(),
  sku_name: z.string()
    .max(500, 'SKU名称长度不能超过500个字符')
    .optional(),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '价格格式不正确，应为数字，最多两位小数')
    .optional(),
  original_price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '原价格式不正确，应为数字，最多两位小数')
    .nullable()
    .optional(),
  cost_price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '成本价格式不正确，应为数字，最多两位小数')
    .nullable()
    .optional(),
  stock: z.number()
    .int('库存必须是整数')
    .min(0, '库存不能为负数')
    .optional(),
  status: z.nativeEnum(ProductSkuStatus).optional(),
  is_default: z.boolean().optional()
})

/**
 * 更新SKU价格验证 Schema
 */
export const updateSkuPriceSchema = z.object({
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, '价格格式不正确，应为数字，最多两位小数')
})

/**
 * 更新SKU库存验证 Schema
 */
export const updateSkuStockSchema = z.object({
  stock: z.number()
    .int('库存必须是整数')
    .min(0, '库存不能为负数')
})

/**
 * 更新SKU状态验证 Schema
 */
export const updateSkuStatusSchema = z.object({
  status: z.nativeEnum(ProductSkuStatus)
})

/**
 * 商品SKU查询参数验证 Schema
 */
export const productSkuQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  spu_id: z.string().optional(),
  sku_code: z.string().optional(),
  status: z.nativeEnum(ProductSkuStatus).optional()
})

/**
 * 创建商品分类验证 Schema
 */
export const createProductCategorySchema = z.object({
  name: z.string()
    .min(1, '分类名称不能为空')
    .max(50, '分类名称长度不能超过50个字符'),
  description: z.string()
    .max(200, '描述长度不能超过200个字符')
    .optional(),
  parent_id: z.string()
    .max(36, '父分类ID长度不能超过36个字符')
    .optional(),
  material_id: z.string()
    .max(36, '素材ID长度不能超过36个字符')
    .optional(),
  status: z.nativeEnum(ProductCategoryStatus).optional()
})

/**
 * 更新商品分类验证 Schema
 */
export const updateProductCategorySchema = createProductCategorySchema.partial()

/**
 * 商品分类查询参数验证 Schema
 */
export const productCategoryQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  name: z.string().optional(),
  parent_id: z.string().optional(),
  status: z.nativeEnum(ProductCategoryStatus).optional()
})

/**
 * 创建商品品牌验证 Schema
 */
export const createProductBrandSchema = z.object({
  name: z.string()
    .min(1, '品牌名称不能为空')
    .max(50, '品牌名称长度不能超过50个字符'),
  description: z.string()
    .max(200, '描述长度不能超过200个字符')
    .optional(),
  logo_id: z.string()
    .max(36, 'Logo ID长度不能超过36个字符')
    .optional(),
  status: z.nativeEnum(ProductBrandStatus).optional()
})

/**
 * 更新商品品牌验证 Schema
 */
export const updateProductBrandSchema = createProductBrandSchema.partial()

/**
 * 商品品牌查询参数验证 Schema
 */
export const productBrandQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  name: z.string().optional(),
  status: z.nativeEnum(ProductBrandStatus).optional()
})

/**
 * 创建商品属性键验证 Schema
 */
export const createProductAttributeKeySchema = z.object({
  spu_id: z.string()
    .min(1, '商品SPU ID不能为空')
    .max(36, '商品SPU ID长度不能超过36个字符'),
  name: z.string()
    .min(1, '属性名称不能为空')
    .max(50, '属性名称长度不能超过50个字符'),
  key: z.string()
    .max(50, '属性键长度不能超过50个字符')
    .optional(),
  required: z.boolean().optional()
})

/**
 * 更新商品属性键验证 Schema
 */
export const updateProductAttributeKeySchema = z.object({
  name: z.string()
    .max(50, '属性名称长度不能超过50个字符')
    .optional(),
  key: z.string()
    .max(50, '属性键长度不能超过50个字符')
    .optional(),
  required: z.boolean().optional()
})

/**
 * 创建商品属性值验证 Schema
 */
export const createProductAttributeValueSchema = z.object({
  attribute_key_id: z.string()
    .min(1, '属性键ID不能为空')
    .max(36, '属性键ID长度不能超过36个字符'),
  value: z.string()
    .min(1, '属性值不能为空')
    .max(100, '属性值长度不能超过100个字符'),
  value_id: z.string()
    .max(100, '属性值ID长度不能超过100个字符')
    .optional(),
  image_id: z.string()
    .max(36, '图片ID长度不能超过36个字符')
    .optional()
})

/**
 * 更新商品属性值验证 Schema
 */
export const updateProductAttributeValueSchema = z.object({
  value: z.string()
    .max(100, '属性值长度不能超过100个字符')
    .optional(),
  value_id: z.string()
    .max(100, '属性值ID长度不能超过100个字符')
    .optional(),
  image_id: z.string()
    .max(36, '图片ID长度不能超过36个字符')
    .nullable()
    .optional()
})
