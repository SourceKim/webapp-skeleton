# 工具函数模块说明

此目录包含了从原 `mutils.ts` 拆分出来的各个功能模块，按功能分类组织代码。

## 📁 文件结构

### 核心模块

- **`form-component.ts`** - 表单动态组件相关
  - `generateDynamicColumn()` - 构造表单动态组件参数
  - `getItemListRef()` - 生成itemList响应式数据

- **`form-binding.ts`** - 数据绑定相关
  - `vModelValue()` - 生成双向绑定属性值

- **`form-config.ts`** - 表单配置相关
  - `generatePlaceholder()` - 生成默认placeholder
  - `generateLabelWidth()` - 自动计算labelWidth

- **`form-validation.ts`** - 验证相关
  - `generateFormRules()` - 增强el-form表单验证
  - `getRules()` - 设置验证规则

- **`table-formatter.ts`** - 格式化相关
  - `generateFormatter()` - 生成默认formatter函数

- **`form-helpers.ts`** - 便捷创建函数
  - `createFormColumn()` - 表单列类型辅助函数
  - `formColumnTypes` - 常用表单列类型的便捷创建函数

### 验证相关模块

- **`validation-types.ts`** - 验证类型定义
  - `datatype` - 常用验证正则表达式和函数

- **`validation-rules.ts`** - 具体验证规则函数
  - `validateRequired()` - 验证必填项
  - `validateType()` - 验证数据类型
  - `validatePattern()` - 验证正则表达式
  - `validateDateFormat()` - 验证日期格式
  - `validateMaxLength()` - 验证最大长度
  - `validateMinLength()` - 验证最小长度
  - `validateMin()` - 验证最小值
  - `validateMax()` - 验证最大值
  - `validateItemList()` - 验证下拉选项

- **`validation-core.ts`** - 核心验证函数
  - `validate()` - 主验证函数
  - `fieldValid()` - 单个字段验证
  - `ruleValid()` - 单个规则验证

### 其他文件

- **`validate.ts`** - 验证模块统一导出（向后兼容）
- **`index.ts`** - 所有工具函数统一导出接口

## 🔄 使用方式

### 推荐使用方式（从具体模块导入）
```typescript
// 表单组件相关
import { generateDynamicColumn } from '@/components/utils/form-component'
import { vModelValue } from '@/components/utils/form-binding'
import { generatePlaceholder } from '@/components/utils/form-config'

// 验证相关
import { validate } from '@/components/utils/validation-core'
import { datatype } from '@/components/utils/validation-types'
import { validateRequired, validateType } from '@/components/utils/validation-rules'
```

### 统一导入方式
```typescript
// 从统一入口导入
import { 
  generateDynamicColumn, 
  vModelValue, 
  generatePlaceholder,
  validate,
  datatype
} from '@/components/utils'
```

### 向后兼容方式（不推荐）
```typescript
// 仍然支持从旧路径导入，但标记为过时
import { generateDynamicColumn } from '@/components/mutils'
```

## ✨ 优势

1. **职责分离** - 每个文件只负责特定功能
2. **易于维护** - 相关功能集中在一起
3. **按需加载** - 可以只导入需要的功能
4. **向后兼容** - 不会破坏现有代码
5. **类型安全** - 完整的 TypeScript 支持

## 🚀 迁移建议

对于新代码，建议直接从具体模块导入所需函数。对于现有代码，可以逐步迁移到新的导入方式。 