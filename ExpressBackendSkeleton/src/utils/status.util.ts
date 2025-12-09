/**
 * 状态转换工具函数
 * 将英文状态枚举值转换为中文
 */

import { ProductSpuStatus } from '@/modules/product/spu/product-spu.model';
import { ProductBrandStatus } from '@/modules/product/brand/product-brand.model';
import { ProductCategoryStatus } from '@/modules/product/category/product-category.model';
import { ProductSkuStatus } from '@/modules/product/sku/product-sku.model';

/**
 * SPU 状态转换
 */
export function convertSpuStatusToChinese(status: ProductSpuStatus | string): string {
  const statusMap: Record<string, string> = {
    [ProductSpuStatus.DRAFT]: '草稿',
    [ProductSpuStatus.ON_SHELF]: '上架',
    [ProductSpuStatus.OFF_SHELF]: '下架',
  };
  return statusMap[status] || status;
}

/**
 * Brand/Category 状态转换（ENABLED/DISABLED）
 */
export function convertEnabledStatusToChinese(status: ProductBrandStatus | ProductCategoryStatus | string): string {
  // 由于 ProductBrandStatus 和 ProductCategoryStatus 的值相同，直接使用字符串值作为键
  const statusMap: Record<string, string> = {
    'ENABLED': '启用',
    'DISABLED': '禁用',
  };
  return statusMap[status] || status;
}

/**
 * SKU 状态转换
 */
export function convertSkuStatusToChinese(status: ProductSkuStatus | string): string {
  const statusMap: Record<string, string> = {
    [ProductSkuStatus.ON_SHELF]: '上架',
    [ProductSkuStatus.OFF_SHELF]: '下架',
  };
  return statusMap[status] || status;
}
