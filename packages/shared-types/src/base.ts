/**
 * 基础类型定义
 */

// 通用 ID 类型
export type ID = string | number

// 时间戳类型
export type Timestamp = number | string | Date

/**
 * 通用实体基础字段
 * 与后端 BaseEntity 类字段保持一致
 */
export interface BaseEntity {
  id: ID
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at?: Timestamp | null
}
