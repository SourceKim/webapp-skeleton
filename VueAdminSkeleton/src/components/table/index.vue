<template>
    <div :style="props.style" :class="wrapperClass1">
        <div :class="wrapperClass2">
            <TopFilter
            v-if="props.isFilterTable && props.filterColumns"
            class="top-filter"
            :columns="props.filterColumns"
            :param="pageQuery.param || {}"
            :loading="loadingRef"
            :onSearch="fetchQuery"
            />
            <TableCore
            :isFilterTable="props.isFilterTable"
            :selection="props.selection ?? 'single'"
            :data="pageData"
            :sortedTableColumns="sortColumnsParams || []"
            :tableParam="tableParam"
            >
            <template #left-action>
                <slot name="left-action"></slot>    
            </template>
            <template #right-action>
                <slot name="right-action"></slot>
            </template>
            <template #total-view v-if="pagination.layout.includes('total')">
                <TotalView 
                :total="Math.max(pagination.total ?? 0, pageData.length)"
                :selection="props.selection" 
                :selectionLimit="props.selectionLimit ?? 10" 
                :selectedCount="selectionRows.length" /> 
            </template>
            <template #pagination>
              <el-scrollbar :class="['table-scrollbar', 'pagination']" wrap-style="height: auto;">
                <el-pagination
                  v-bind="{...pagination}"
                  :disabled="loadingRef"
                  :total="Math.max(pagination.total ?? 0, pageData.length)"
                  :size="layoutStore.widthShrink ? 'small' : layoutStore.size"
                  :pager-count="layoutStore.widthShrink ? 5 : 7"
                  :layout="layoutStore.widthShrink ? 'prev, pager, next' : pagination.layout.split(',').filter((i) => i !== 'total').join(',')"
                  :onCurrentChange="fetchQuery"
                  :onSizeChange="fetchQuery"
                  v-model:current-page="pageQuery.currentPage"
                  v-model:page-size="pageQuery.pageSize"
                />
              </el-scrollbar>
            </template>
            </TableCore>
        </div>
    </div>
</template>

<script lang="ts" setup generic="T extends object, F extends object">

import { ElScrollbar, ElPagination } from 'element-plus'
import TopFilter from './TopFilter.vue'
import TotalView from './TotalView.vue'
import TableCore from './TableCore.vue'
import { useTable } from './composables/useTable'
import type { MTableProps } from '../interface/table'

const props = withDefaults(defineProps<MTableProps<T, F>>(), {
    layout: 'auto',
    defaultQuery: true,
    selectionLimit: 10,
    isFilterTable: true,
    selection: 'single',
    isPage: true,
    height: '100%',
    width: '100%',
    fit: true,
    showHeader: true,
})

const emit = defineEmits<{
    (e: 'selection-change', rows: T[]): void
    (e: 'row-click', row: T, column: import('../interface/table').CommonTableColumn<T>, event: Event): void
}>()

// 使用组合式 API
const {
    // 状态
    loadingRef,
    layoutStore,
    pageQuery,
    pagination,
    pageData,
    selectionRows,
    sortColumnsParams,
    wrapperClass1,
    wrapperClass2,
    tableParam,
    
    // 方法
    fetchQuery
} = useTable(props, emit)


// 暴露方法给父组件
defineExpose({
    fetchQuery
})

</script>

<style scoped lang="scss">
.m-table {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .top-filter {
    border: var(--el-border);
    border-color: rgba(0, 0, 0, 0);
    margin-bottom: 10px;
    border-radius: var(--el-border-radius-base);
    flex-shrink: 0;
  }

  .table-view {
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color);
    flex-grow: 1;

    .radio-selection {
      :deep(.el-table-column--selection .el-checkbox) {
        visibility: hidden;
      }
    }
  }

  :deep(.action-btn) {
    padding: 0 4px;
    margin-left: 3px;
    margin-right: 0;

    > span {
      margin-left: 2px;
    }
  }

  .pagination {
    height: auto;
    padding-top: 10px;
  }
}
//定制高度
.custom-height {
  .table-view {
    height: auto;

    .table-form {
      height: auto;
    }
  }
}
</style>
