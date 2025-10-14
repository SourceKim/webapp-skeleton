import type { Permission } from '@/api/user/permission.d'
import type { Role } from '@/api/user/role.d'

/**
 * 权限表格行数据类型
 */
export interface PermissionTableRow extends Permission {
  created_at: string
  updated_at: string
}

/**
 * 角色表格行数据类型
 */
export interface RoleTableRow extends Role {
  created_at: string
  updated_at: string
}

/**
 * 角色权限数据类型
 */
export interface RolePermissionData {
  roleId: string
  assignedPermissions: Permission[]
  availablePermissions: Permission[]
}

/**
 * 权限选择组件的 props 类型
 */
export interface RolePermissionFormProps {
  modelValue: string[]
  handleType: FormHandleType
  roleId?: string
}

/**
 * 表单处理类型
 */
export type FormHandleType = 'add' | 'edit' | 'detail'

/**
 * 表格操作按钮点击事件参数
 */
export interface TableActionParams<T> {
  row: T
  index: {
    $index: number
    $fullIndex: number
  }
}

/**
 * 表格单元格样式函数参数
 */
export interface CellStyleParams<T = Record<string, unknown>> {
  row: T
  column: {
    property: string
    [key: string]: unknown
  }
  rowIndex: number
  columnIndex: number
}

/**
 * 表格选择变化事件参数
 */
export type SelectionChangeParams<T> = T[] 