/**
 * @deprecated 此文件已拆分为多个模块，建议直接从对应模块导入
 * 为保持向后兼容性，此文件重新导出所有函数
 */

// 从拆分后的模块重新导出
export { default } from './validation-core'
export { fieldValid, ruleValid } from './validation-core'
export { datatype } from './validation-types'
export * from './validation-rules'
