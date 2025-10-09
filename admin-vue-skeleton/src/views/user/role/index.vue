<template>
    <div class='root'>
      <!-- 表格 -->
      <m-table
        class='m-table'
        ref='tableRef'
        is-filter-table
        is-complex-filter
        row-key='id'
        selection='multiple'
        :columns="columns"
        :fetch-data="getRoles"
        @selection-change='handleSelectionChange'
        v-model:data="data"
        :cell-style="cellStyle"
      >
        <!-- 右侧操作 -->
        <template #right-action>
          <el-button type='primary' @click="openForm('add', createEmptyRole())" icon='upload'>新增</el-button>
        </template>
      </m-table>
      
      <!-- 表单弹窗，用以增改查 -->
      <el-dialog
        :title="handleType && $t('common.' + handleType)"
        v-model="formVisible"
        draggable
        destroy-on-close
        append-to-body
        :close-on-click-modal="false"
        width="50%"
      >
        <role-form :handle-type="handleType" :model-value="row" @close="formClose" style="height: 60vh" />
      </el-dialog>
    </div>
</template>
  
<script setup lang='ts'>
import mTable from '@/components/table/index.vue'
import { getRoles, deleteRole } from '@/api/user/role'
import { computed, ref } from 'vue'
import RoleForm from './form.vue'
import { useI18n } from 'vue-i18n'
import type { CommonTableColumn } from '@/components/interface/table'
import type { 
  RoleTableRow, 
  FormHandleType, 
  CellStyleParams, 
  SelectionChangeParams 
} from '../types'

// 表格
const data = ref<RoleTableRow[]>([]) // 表格模型数据
const tableRef = ref() // 表格的引用
const selectRows = ref<RoleTableRow[]>([]) // 选中行
const { t } = useI18n()

// 表单
const formVisible = ref(false) // 表单是否显示
const handleType = ref<FormHandleType>('add') // 表单类型
const row = ref<RoleTableRow | null>(null) // 表单数据

// 创建空的角色对象
function createEmptyRole(): RoleTableRow {
  return {
    id: '',
    name: '',
    description: '',
    created_at: '',
    updated_at: ''
  }
}

const columns = computed<CommonTableColumn<RoleTableRow>[]>(() => [
  { prop: 'name', label: '名称' },
  { prop: 'description', label: '描述' },
  { prop: 'created_at', label: '创建时间' },
  { prop: 'updated_at', label: '更新时间' },
  {
      type: 'operation',
      fixed: 'right',
      align: 'center',
      buttons: [
        { 
          label: t('common.edit'), 
          icon: 'edit', 
          onClick: (row: RoleTableRow) => openForm('edit', row) 
        },
        { 
          label: t('common.detail'), 
          icon: 'document', 
          onClick: (row: RoleTableRow) => openForm('detail', row)
        },
        { 
          label: t('common.del'), 
          icon: 'delete', 
          type: 'danger', 
          onClick: (row: RoleTableRow) => del([row]) 
        }
      ]
    }
])

// 表格单元格样式
function cellStyle({ row, column }: CellStyleParams<RoleTableRow>) {
  if (column.property === 'status' && 'status' in row && row.status === 1) {
    return {
      color: 'green'
    }
  }
}

// 处理选择变化
function handleSelectionChange(rows: SelectionChangeParams<RoleTableRow>) {
  selectRows.value = rows
}

function openForm(type: FormHandleType, r: RoleTableRow) {
  row.value = r // 赋值 row
  handleType.value = type // 赋值 handleType
  formVisible.value = true // 显示 form
}

function del(rows: RoleTableRow[]) {
  console.log('delete rows:', rows)
  if (rows.length > 0 && rows[0].id) {
    deleteRole(rows[0].id, {
      showLoading: true,
      showBeforeConfirm: true,
      showSuccessMsg: true,
      confirmMsg: t('common.confirmDelete')
    }).then(() => {
      tableRef.value?.fetchQuery()
    })
  }
}

function formClose(needRefresh: boolean) {
  formVisible.value = false
  if (needRefresh) {
    tableRef.value?.fetchQuery()
  }
}

</script>
  
<style lang='scss' scoped>
.m-table {
    height: 100%;
}
</style>
  