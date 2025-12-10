<template>
    <div :class="tableClass">
          <ElForm class="table-top">
            <el-scrollbar class="table-scrollbar" view-style="display: flex; justify-content: space-between;">
              <div class="left-action">
                <slot name="total-view"></slot>
                <slot name="left-action"></slot>
              </div>
              <div class="right-action">
                <slot name="right-action"></slot>
              </div>
            </el-scrollbar>
          </ElForm>
          <el-form
            class="table-form"
          >     
            <el-table
              v-bind="tableParam"
              :class="tableViewClass"
              :data="props.data"
              style="width: 100%">
              <template v-for="column in props.sortedTableColumns" :key="column._id">
                <!-- 隐藏列不渲染 -->
                <el-table-column v-bind="columnParam(column)">
                  <template v-for="(slot, name) in column.slots" :key="name" #[name]="scope">
                    <component :is="slot" v-bind="scope" />
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form>
          <slot name="pagination"></slot>
        </div>
</template>

<script setup lang="ts" generic="T extends object">
import { ElForm } from 'element-plus'
import { ElTable, ElTableColumn } from 'element-plus'
import { ElScrollbar } from 'element-plus'
import { computed } from 'vue';
import type { CommonTableColumn, TableSelection } from '../interface/table';
import type { TableProps } from 'element-plus'
import { useLayoutStore } from '@/stores/layout'

interface Props {
    isFilterTable: boolean
    selection: TableSelection
    tableParam: Partial<TableProps<T>> & Record<string, unknown>
    data: T[]
    sortedTableColumns: CommonTableColumn<T>[]
}

const props = defineProps<Props>()

const layoutStore = useLayoutStore()

const tableClass = computed(() => {
    return {
        'table-view': true,
        'table-view-filter': props.isFilterTable,
        'table-view-mobile': layoutStore.widthShrink
    }
})
const tableViewClass = computed(() => {
    return {
        'el-table-view': true,
        'radio-selection': props.selection === 'single'
    }
})

const columnParam = (column: CommonTableColumn<T>) => {
    const parm = {...column}
    delete parm.children
    delete parm.slots
    return parm
}
</script>

<style scoped>
.table-view {
    width: 100%;
}

.table-view-filter {
    border: var(--el-border);
    border-color: rgba(0, 0, 0, 0);
    padding: 15px;
    border-radius: var(--el-border-radius-base);
}

.table-view-mobile.table-view-filter {
    padding: 5px;
}

.table-top {
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow-x: auto;
}

.table-scrollbar {
    width: 100%;

    :deep(.el-scrollbar__thumb) {
    z-index: 100000;
    }
}

.left-action {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.right-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.table-form {
      flex-grow: 1;
      height: 0;
      width: 100%;

      .el-table-view {
        height: 100%;
        max-height: 100%;
        width: 100%;
      }

      :deep(.el-form-item__error--inline) {
        margin-left: 0;
      }

      :deep(.el-zoom-in-top-leave-active) {
        transition: none;
      }

      :deep(.el-form-item__content) {
        justify-content: center;
      }
    }
</style>