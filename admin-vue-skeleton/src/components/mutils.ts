/**
 * @deprecated 此文件已拆分为多个模块，建议直接从对应模块导入
 * 为保持向后兼容性，此文件重新导出所有函数
 */

// 从拆分后的模块重新导出所有函数
export {
  // 表单动态组件相关
  generateDynamicColumn,
  getItemListRef,
  
  // 数据绑定相关
  vModelValue,
  
  // 表单配置相关
  generatePlaceholder,
  generateLabelWidth,
  
  // 验证相关
  generateFormRules,
  getRules,
  
  // 格式化相关
  generateFormatter,
  
  // 便捷创建函数
  createFormColumn,
  formColumnTypes
} from './utils'
