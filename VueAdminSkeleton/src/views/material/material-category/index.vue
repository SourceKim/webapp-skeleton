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
        :fetch-data="getMaterialCategories"
        @selection-change='(rows) => (selectRows = rows)'
        v-model:data="data"
        :cell-style="cellStyle"
      >
        <!-- 右侧操作 -->
        <template #right-action>
          <el-button type='primary' @click="openForm('add', {})" icon='upload'>新增</el-button>
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
        <material-category-form :handle-type="handleType" :model-value="row" @close="formClose" style="height: 60vh" />
      </el-dialog>
    </div>
</template>
  
<script setup lang='ts'>
  import MTable from '@/components/table/index.vue'
  import { getMaterialCategories, deleteMaterialCategory } from '@/api/material/material-category'
  import { computed, ref } from 'vue'
  import MaterialCategoryForm from './form.vue'
  import { useI18n } from 'vue-i18n'

  // 表格
  const data = ref<any[]>([]) // 表格模型数据
  const tableRef = ref() // 表格的引用
  const selectRows = ref<any[]>([]) // 选中行
  const { t } = useI18n()
  
  // 表单
  const formVisible = ref(false) // 表单是否显示
  const handleType = ref() // 表单类型
  const row = ref() // 表单数据

  const columns = computed(() => [
    { prop: 'name', label: '名称', type: 'input' as const },
    { prop: 'description', label: '描述', type: 'textarea' as const },
    { prop: 'created_at', label: '创建时间', type: 'datetime' as const },
    { prop: 'updated_at', label: '更新时间', type: 'datetime' as const },
    {
        type: 'operation' as const,
        fixed: 'right' as const,
        align: 'center' as const,
        buttons: [
          { label: t('common.edit'), icon: 'edit', onClick: (row: any) => openForm('edit', row) },
          { label: t('common.detail'), icon: 'document', onClick: (row: any) => openForm('detail', row)},
          { label: t('common.del'), icon: 'delete', type: 'danger' as const, onClick: (row: any) => del([row]) }
        ]
      }
  ])
  
  // 表格单元格样式
  function cellStyle({ row, column }: { row: any; column: any }) {
    if (column.property === 'status' && row.status === 1) {
      return {
        color: 'green'
      }
    }
  }
  
  function openForm(type: string, r: any) {
    row.value = r // 赋值 row
    handleType.value = type // 赋值 handleType
    formVisible.value = true // 显示 form
  }

  function del(rows: any[]) {
    console.log('delete rows:', rows)
    deleteMaterialCategory(rows[0].id).then((response) => {
      console.log(response)
      tableRef.value.fetchQuery()
    })
  }
  
  function formClose(needRefresh: boolean) {
    formVisible.value = false
    if (needRefresh) {
      tableRef.value.fetchQuery()
    }
  }
  
</script>
  
<style lang='scss' scoped>
.m-table {
    height: 100%;
}
</style>
  