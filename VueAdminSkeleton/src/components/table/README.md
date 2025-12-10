# MTable 表格组件

一个功能强大的 Vue 3 表格组件，基于 Element Plus 构建，支持分页、筛选、排序、选择等功能。

## 特性

- ✅ **类型安全**：完整的 TypeScript 支持，使用泛型确保类型安全
- ✅ **分页支持**：内置分页功能，支持前端分页和后端分页
- ✅ **数据筛选**：支持顶部筛选栏，可配置筛选条件
- ✅ **行选择**：支持单选和多选模式
- ✅ **列类型丰富**：支持文本、索引、操作、选择、下拉列表、可编辑、插槽等多种列类型
- ✅ **操作按钮**：内置操作列，支持按钮溢出自动收纳
- ✅ **响应式布局**：自适应移动端和桌面端
- ✅ **自定义插槽**：提供多个插槽用于自定义内容

## 基本用法

### 最简单的表格

```vue
<template>
  <m-table
    :columns="columns"
    :data="tableData"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MTable from '@/components/table/index.vue'
import type { CommonTableColumn } from '@/components/interface/table'

// 定义数据类型
interface User {
  id: number
  name: string
  email: string
  age: number
}

// 表格数据
const tableData = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 }
])

// 列配置
const columns = ref<CommonTableColumn<User>[]>([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'age', label: '年龄', width: 100 }
])
</script>
```

### 带后端数据获取的表格

```vue
<template>
  <m-table
    ref="tableRef"
    :columns="columns"
    :fetch-data="getUserList"
    :filter-param="filterParam"
    :filter-columns="filterColumns"
    selection="multiple"
    @selection-change="handleSelectionChange"
  >
    <template #right-action>
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="danger" @click="handleDelete">删除</el-button>
    </template>
  </m-table>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import MTable from '@/components/table/index.vue'
import type { CommonTableColumn } from '@/components/interface/table'
import type { RestResponse, PageResult } from '@/components/table/types'

interface User {
  id: number
  name: string
  email: string
}

interface FilterParam {
  name?: string
  email?: string
}

const tableRef = ref()
const filterParam = reactive<FilterParam>({})
const selectedRows = ref<User[]>([])

// 筛选列配置
const filterColumns = [
  { prop: 'name', label: '姓名', component: 'el-input' },
  { prop: 'email', label: '邮箱', component: 'el-input' }
]

// 表格列配置
const columns = ref<CommonTableColumn<User>[]>([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'email', label: '邮箱', width: 200 }
])

// 获取数据函数
async function getUserList(
  filters?: FilterParam
): Promise<RestResponse<PageResult<User>>> {
  // 调用后端 API
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      currentPage: 1,
      pageSize: 20,
      param: filters
    })
  })
  return response.json()
}

// 选择变化事件
function handleSelectionChange(rows: User[]) {
  selectedRows.value = rows
}

// 新增
function handleAdd() {
  // 处理新增逻辑
}

// 删除
function handleDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  // 处理删除逻辑
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| `columns` | 表格列配置 | `CommonTableColumn<T>[]` | - | 是 |
| `data` | 表格数据 | `T[]` | `[]` | 是 |
| `fetchData` | 后端数据获取函数 | `TableFetchFunction<T, F>` | - | 否 |
| `filterColumns` | 筛选列配置 | `CommonFormColumn[]` | - | 否 |
| `filterParam` | 筛选参数 | `F` | - | 否 |
| `selection` | 选择模式 | `'single' \| 'multiple' \| false` | `'single'` | 否 |
| `selectionLimit` | 最多可选择行数 | `number` | `10` | 否 |
| `isPage` | 是否分页 | `boolean` | `true` | 否 |
| `isFilterTable` | 是否显示筛选栏 | `boolean` | `true` | 否 |
| `defaultQuery` | 是否默认查询 | `boolean` | `true` | 否 |
| `pagination` | 分页配置 | `TablePagination` | - | 否 |
| `layout` | 布局模式 | `'auto' \| 'stretch'` | `'auto'` | 否 |
| `stripe` | 是否斑马纹 | `boolean` | - | 否 |
| `height` | 表格高度 | `string` | `'100%'` | 否 |
| `width` | 表格宽度 | `string` | `'100%'` | 否 |

> 注意：组件使用泛型 `<T extends object, F extends object>`，其中 `T` 为表格行数据类型，`F` 为筛选参数类型。

### 继承 Element Plus Table Props

组件继承了 Element Plus 的 `TableProps`，除了 `data` 属性（由组件内部管理），其他属性都可以直接使用，如：
- `row-key`
- `border`
- `stripe`
- `size`
- `show-header`
- `highlight-current-row`
- 等等...

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `selection-change` | 选择变化时触发 | `(rows: T[]) => void` |
| `row-click` | 行点击时触发 | `(row: T, column: CommonTableColumn<T>, event: Event) => void` |

## Slots

| 插槽名 | 说明 |
|--------|------|
| `left-action` | 表格左侧操作区域 |
| `right-action` | 表格右侧操作区域 |

## 列类型

### 文本列

最基础的列类型，用于显示文本数据：

```typescript
{ 
  prop: 'name', 
  label: '姓名', 
  width: 120 
}
```

### 索引列

显示行号，支持分页时自动计算：

```typescript
{ 
  type: 'index', 
  label: '序号', 
  width: 80 
}
```

### 选择列

用于行选择，配合 `selection` prop 使用：

```typescript
// 单选模式
{ 
  type: 'selection', 
  selection: 'single' 
}

// 多选模式
{ 
  type: 'selection', 
  selection: 'multiple' 
}
```

### 操作列

用于显示操作按钮，支持按钮溢出自动收纳：

```typescript
{
  type: 'operation',
  label: '操作',
  width: 200,
  maxCount: 3, // 最多显示3个按钮，超出部分收纳到"更多"下拉菜单
  buttons: [
    {
      label: '编辑',
      type: 'primary',
      icon: 'el|edit',
      onClick: (row, index) => {
        console.log('编辑', row, index)
      }
    },
    {
      label: '删除',
      type: 'danger',
      icon: 'el|delete',
      onClick: (row, index) => {
        console.log('删除', row, index)
      },
      disabled: (row) => row.status === 'disabled' // 支持函数或布尔值
    }
  ]
}
```

### 下拉列表列

用于显示选项列表，支持 `itemList` 配置：

```typescript
{
  prop: 'status',
  label: '状态',
  type: 'select',
  itemList: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ],
  formatter: (row, column, cellValue) => {
    const item = itemList.find(i => i.value === cellValue)
    return item?.label || '-'
  }
}
```

### 可编辑列

支持在表格中直接编辑：

```typescript
{
  prop: 'name',
  label: '姓名',
  editable: true,
  editParam: {
    component: 'el-input',
    rules: [{ required: true, message: '请输入姓名' }]
  }
}
```

### 插槽列

使用自定义插槽渲染内容：

```typescript
{
  prop: 'avatar',
  label: '头像',
  slots: {
    default: (scope) => {
      return h('img', {
        src: scope.row.avatar,
        style: 'width: 40px; height: 40px; border-radius: 50%'
      })
    }
  }
}
```

### 图片列

专门用于显示图片：

```typescript
{
  prop: 'image',
  label: '图片',
  type: 'image',
  width: 100
}
```

## 列配置属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `prop` | 对应列内容的字段名 | `string` | - |
| `label` | 显示的标题 | `string` | - |
| `width` | 对应列的宽度 | `string \| number` | - |
| `minWidth` | 对应列的最小宽度 | `string \| number` | - |
| `fixed` | 列是否固定 | `boolean \| 'left' \| 'right'` | - |
| `align` | 对齐方式 | `'left' \| 'center' \| 'right'` | `'left'` |
| `formatter` | 用来格式化内容 | `(row, column, cellValue) => string` | - |
| `sortable` | 对应列是否可以排序 | `boolean \| 'custom'` | - |
| `hidden` | 是否隐藏列 | `boolean` | `false` |
| `required` | 是否显示必填标记 | `boolean` | - |
| `comment` | 列标题的备注说明 | `VNode` | - |
| `showOverflowTooltip` | 当内容过长被隐藏时显示 tooltip | `boolean` | `true` |
| `children` | 多级表头 | `TableColumn<T>[]` | - |

## 分页配置

通过 `pagination` prop 配置分页：

```typescript
const pagination = {
  total: 0,
  currentPage: 1,
  pageSize: 20,
  pageSizes: [5, 10, 20, 50, 100],
  background: true,
  layout: 'total,sizes,prev,pager,next,jumper',
  defaultPageSize: 20
}
```

## 完整示例

```vue
<template>
  <div class="user-management">
    <m-table
      ref="tableRef"
      class="m-table"
      is-filter-table
      row-key="id"
      selection="multiple"
      :filter-param="filterParam"
      :filter-columns="filterColumns"
      :columns="columns"
      :fetch-data="getUserList"
      :selection-limit="10"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- 左侧操作 -->
      <template #left-action>
        <span>共 {{ totalCount }} 条数据</span>
      </template>

      <!-- 右侧操作 -->
      <template #right-action>
        <el-button type="primary" icon="plus" @click="handleAdd">
          新增用户
        </el-button>
        <el-button 
          type="danger" 
          icon="delete" 
          :disabled="selectedRows.length === 0"
          @click="handleDelete"
        >
          删除选中
        </el-button>
      </template>
    </m-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import MTable from '@/components/table/index.vue'
import type { CommonTableColumn } from '@/components/interface/table'
import type { RestResponse, PageResult } from '@/components/table/types'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface User {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive'
  avatar?: string
}

interface FilterParam {
  name?: string
  email?: string
  status?: string
}

// 响应式数据
const tableRef = ref()
const filterParam = reactive<FilterParam>({})
const selectedRows = ref<User[]>([])
const totalCount = ref(0)

// 筛选列配置
const filterColumns = [
  { 
    prop: 'name', 
    label: '姓名', 
    component: 'el-input',
    placeholder: '请输入姓名'
  },
  { 
    prop: 'email', 
    label: '邮箱', 
    component: 'el-input',
    placeholder: '请输入邮箱'
  },
  {
    prop: 'status',
    label: '状态',
    component: 'el-select',
    itemList: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
]

// 表格列配置
const columns = computed<CommonTableColumn<User>[]>(() => [
  { prop: 'id', label: 'ID', width: 80 },
  {
    prop: 'avatar',
    label: '头像',
    width: 80,
    align: 'center',
    slots: {
      default: (scope) => {
        if (scope.row.avatar) {
          return h('img', {
            src: scope.row.avatar,
            style: 'width: 40px; height: 40px; border-radius: 50%'
          })
        }
        return h('span', '-')
      }
    }
  },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'age', label: '年龄', width: 100 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    type: 'select',
    itemList: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ],
    formatter: (row, column, cellValue) => {
      return cellValue === 'active' ? '启用' : '禁用'
    }
  },
  {
    type: 'operation',
    label: '操作',
    width: 200,
    maxCount: 3,
    buttons: [
      {
        label: '编辑',
        type: 'primary',
        icon: 'el|edit',
        onClick: (row) => {
          handleEdit(row)
        }
      },
      {
        label: '删除',
        type: 'danger',
        icon: 'el|delete',
        onClick: (row) => {
          handleDeleteSingle(row)
        },
        disabled: (row) => row.status === 'inactive'
      },
      {
        label: '查看',
        type: 'info',
        icon: 'el|view',
        onClick: (row) => {
          handleView(row)
        }
      }
    ]
  }
])

// 获取用户列表
async function getUserList(
  filters?: FilterParam
): Promise<RestResponse<PageResult<User>>> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPage: 1,
        pageSize: 20,
        param: filters
      })
    })
    const result = await response.json()
    if (result.success && result.data) {
      totalCount.value = result.data.total
    }
    return result
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
    return {
      success: false,
      data: {
        items: [],
        total: 0
      }
    }
  }
}

// 选择变化
function handleSelectionChange(rows: User[]) {
  selectedRows.value = rows
  console.log('选中的行:', rows)
}

// 行点击
function handleRowClick(row: User, column: CommonTableColumn<User>, event: Event) {
  console.log('点击行:', row, column)
}

// 新增
function handleAdd() {
  console.log('新增用户')
  // 打开新增对话框
}

// 编辑
function handleEdit(row: User) {
  console.log('编辑用户:', row)
  // 打开编辑对话框
}

// 查看
function handleView(row: User) {
  console.log('查看用户:', row)
  // 打开查看对话框
}

// 删除单个
async function handleDeleteSingle(row: User) {
  try {
    await ElMessageBox.confirm(`确认删除用户 "${row.name}"？`, '提示', {
      type: 'warning'
    })
    // 调用删除 API
    ElMessage.success('删除成功')
    tableRef.value?.fetchQuery()
  } catch {
    // 用户取消
  }
}

// 批量删除
async function handleDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个用户？`,
      '提示',
      { type: 'warning' }
    )
    // 调用批量删除 API
    ElMessage.success('删除成功')
    tableRef.value?.fetchQuery()
    selectedRows.value = []
  } catch {
    // 用户取消
  }
}
</script>

<style scoped lang="scss">
.user-management {
  height: 100%;
  padding: 20px;
}
</style>
```

## 方法

通过 ref 可以调用组件的方法：

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `fetchQuery` | 手动触发数据查询 | - |

```vue
<template>
  <m-table ref="tableRef" ... />
</template>

<script setup lang="ts">
const tableRef = ref()

// 手动刷新数据
function refresh() {
  tableRef.value?.fetchQuery()
}
</script>
```

## 注意事项

1. **类型安全**：使用组件时务必指定泛型类型 `<T, F>`，确保类型安全
2. **数据获取**：如果使用 `fetchData`，确保返回的数据格式符合 `RestResponse<PageResult<T>>` 结构
3. **分页**：使用 `fetchData` 时，分页由后端控制；不使用 `fetchData` 时，分页由前端控制
4. **选择限制**：设置 `selectionLimit` 可以限制最多选择的行数
5. **响应式**：组件会根据布局状态自动调整分页器样式（移动端/桌面端）

## 类型定义

```typescript
// 分页查询参数
interface PageQuery<T = Record<string, unknown>> {
  isPage?: boolean
  currentPage?: number
  pageSize?: number
  param?: T
  filters?: T
}

// 分页结果
interface PageResult<T = object> {
  items: T[]
  total: number
  currentPage?: number
  pageSize?: number
}

// REST API 响应
interface RestResponse<T = unknown> {
  code?: number
  message?: string
  data?: T
  success?: boolean
}

// 表格数据获取函数
type TableFetchFunction<T, F> = (
  filters?: F,
  context?: { loadingRef?: Ref<boolean> }
) => Promise<RestResponse<PageResult<T>>>
```

## 更新日志

- **v1.0.0**: 初始版本，支持基本表格功能
- 支持泛型类型，移除所有 `any` 类型
- 优化类型定义，提升类型安全性
