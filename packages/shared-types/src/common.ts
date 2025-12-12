/**
 * 通用工具类型定义
 */

/**
 * 筛选操作符枚举
 * 用于构建查询筛选条件
 */
export enum FilterOperator {
  EQUALS = 'eq',           // 等于
  NOT_EQUALS = 'ne',       // 不等于
  LIKE = 'like',           // 模糊匹配
  ILIKE = 'ilike',         // 忽略大小写的模糊匹配
  IN = 'in',               // 在...之中
  NOT_IN = 'not_in',       // 不在...之中
  GREATER_THAN = 'gt',     // 大于
  GREATER_THAN_EQUAL = 'gte', // 大于等于
  LESS_THAN = 'lt',        // 小于
  LESS_THAN_EQUAL = 'lte', // 小于等于
  IS_NULL = 'is_null',     // 为空
  IS_NOT_NULL = 'is_not_null', // 不为空
  BETWEEN = 'between',     // 在...之间
}

/**
 * 筛选条件接口
 * 用于构建查询筛选条件
 */
export interface FilterCondition {
  field: string
  operator: FilterOperator
  value: any
}
