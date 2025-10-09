# 表格组件重构说明

此目录包含了从原 `index.vue` 拆分出来的各个功能模块，按功能分类组织代码。

## 📁 文件结构

### 类型定义
- **`types.ts`** - 表格相关类型定义
  - `PageQuery` - 分页查询参数
  - `PageResult` - 分页结果
  - `RestResponse` - REST API 响应
  - `TableSelectionMode` - 表格选择模式
  - `TableSortColumn` - 表格排序列

### Composables 模块

- **`composables/useTableData.ts`** - 表格数据管理逻辑
  - 数据获取和分页
  - 查询参数管理
  - 加载状态控制

- **`composables/useTableSelection.ts`** - 表格选择逻辑
  - 单选/多选处理
  - 选择限制控制
  - 行点击事件处理

- **`composables/useTableColumns.ts`** - 表格列配置逻辑
  - 列初始化和配置
  - 排序列生成
  - 操作列生成
  - 头部插槽生成

- **`composables/useTable.ts`** - 表格主要逻辑组合
  - 整合所有子逻辑
  - 事件处理
  - 样式类名计算

### 组件文件

- **`index-new.vue`** - 重构后的主组件（简化版）
- **`index.vue`** - 原始组件（待替换）

## 🎯 重构优势

### 1. **职责分离**
- 数据管理 ↔️ 列配置 ↔️ 选择逻辑
- 每个 composable 只负责特定功能

### 2. **代码简化**
- 原来 511 行 → 现在主组件 < 100 行
- 复杂逻辑拆分成多个小函数

### 3. **可复用性**
- 各个 composable 可以独立使用
- 便于测试和维护

### 4. **类型安全**
- 补充了缺失的类型定义
- 完整的 TypeScript 支持

## 🔧 使用方式

### 基础使用（推荐）
```vue
<script setup lang="ts">
import { useTable } from './composables/useTable'

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const tableLogic = useTable(props, emit)
</script>
```

### 独立使用 Composables
```typescript
// 只使用数据管理
import { useTableData } from './composables/useTableData'
const { data, pageQuery, fetchQuery } = useTableData(props)

// 只使用选择逻辑
import { useTableSelection } from './composables/useTableSelection'
const { selectionRows, selectionChange } = useTableSelection(props)

// 只使用列配置
import { useTableColumns } from './composables/useTableColumns'
const { tableColumnsParams, sortColumnsParams } = useTableColumns(props, context)
```


## 🛠️ 开发指南

### 添加新功能
1. 确定功能属于哪个 composable
2. 在对应的文件中添加逻辑
3. 在主组合函数中整合
4. 更新类型定义

### 调试建议
- 每个 composable 都可以独立调试
- 使用 Vue DevTools 查看 composable 状态
- 在对应模块中添加日志 