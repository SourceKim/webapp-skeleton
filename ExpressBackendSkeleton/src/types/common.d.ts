/**
 * 通用类型定义
 */

/**
 * 用户统计信息类型
 */
export interface UserStats {
  couponCount: number;
  pointCount: number;
  totalConsumption: string;
}

/**
 * 更新选中状态的请求体类型
 */
export interface UpdateSelectedRequestBody {
  cart_item_ids?: string[];
  ids?: string[];
  selected?: boolean | string | number;
  [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * 基本 JSON 值类型
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * 对象值类型（用于查询过滤器）
 */
export type ObjectValue = JsonValue | ObjectValue[] | { [key: string]: ObjectValue };
