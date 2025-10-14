// 表单动态组件相关
export { generateDynamicColumn, getItemListRef } from './form-component'

// 数据绑定相关
export { vModelValue } from './form-binding'

// 表单配置相关
export { generatePlaceholder, generateLabelWidth } from './form-config'

// 表单验证相关
export { generateFormRules, getRules } from './form-validation'

// 格式化相关
export { generateFormatter } from './table-formatter'

// 便捷创建函数
export { createFormColumn, formColumnTypes } from './form-helpers'

// 验证工具相关
export { default as validate, fieldValid, ruleValid } from './validation-core'
export { datatype } from './validation-types'
export * from './validation-rules'

// 向后兼容 - 重新导出旧验证模块
export * from './validate' 