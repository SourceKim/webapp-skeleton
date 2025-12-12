/**
 * 购物车相关类型定义
 */
import { BaseEntity } from '../../base'
import type { User } from '../user'
import type { ProductSku } from './product'

/**
 * 购物车实体接口
 */
export interface Cart extends BaseEntity {
  user_id: string
  user?: User // 关联用户
  sku_id: string
  sku?: ProductSku // 关联商品SKU
  quantity: number
  selected: boolean
}
