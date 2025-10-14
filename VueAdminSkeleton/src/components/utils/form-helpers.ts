import type { CommonColumnType } from '@/components/interface'
import type { CommonFormColumn } from '@/components/interface/form'

/**
 * 表单列类型辅助函数，避免重复使用 as const
 * @param config 表单列配置
 * @returns 表单列配置
 */
export const createFormColumn = <T extends object>(
  config: Omit<CommonFormColumn<T>, 'type'> & { 
    type: CommonColumnType | 'separator' 
  }
): CommonFormColumn<T> => {
  return config as CommonFormColumn<T>
}

/**
 * 常用表单列类型的便捷创建函数
 */
export const formColumnTypes = {
  /** 输入框 */
  input: <T extends object>(config: Omit<CommonFormColumn<T>, 'type'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'input' }),
  
  /** 多行文本框 */
  textarea: <T extends object>(config: Omit<CommonFormColumn<T>, 'type'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'textarea' }),
  
  /** 下拉选择 */
  select: <T extends object>(config: Omit<CommonFormColumn<T>, 'type'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'select' }),
  
  /** 开关 */
  switch: <T extends object>(config: Omit<CommonFormColumn<T>, 'type'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'switch' }),
  
  /** 复选框组 */
  checkboxGroup: <T extends object>(config: Omit<CommonFormColumn<T>, 'type'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'checkbox-group' }),
  
  /** 文件上传 */
  uploadFile: <T extends object>(config: Omit<CommonFormColumn<T>, 'type'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'upload-file' }),
  
  /** 只读输入框 */
  readonly: <T extends object>(config: Omit<CommonFormColumn<T>, 'type' | 'readonly'>): CommonFormColumn<T> => 
    createFormColumn({ ...config, type: 'input', readonly: true })
} 