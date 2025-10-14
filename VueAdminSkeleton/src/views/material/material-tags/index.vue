<template>
    <div class='root'>
      <!-- 表格 -->
      <m-table
        class='m-table'
        ref='tableRef'
        generic="MaterialTag, MaterialTagFilter"
        is-filter-table
        is-complex-filter
        row-key='id'
        selection='multiple'
        :columns="columns"
        :fetch-data="getMaterialTags"
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
        <material-tags-form :handle-type="handleType" :model-value="row" @close="formClose" style="height: 60vh" />
      </el-dialog>
    </div>
</template>
  
<script setup lang='ts'>
  import MTable from '@/components/table/index.vue'
  import { getMaterialTags, deleteMaterialTag } from '@/api/material/material-tags'
  import { computed, ref } from 'vue'
  import MaterialTagsForm from './form.vue'
  import { useI18n } from 'vue-i18n'
  import type { MaterialTag } from '@/api/types/material'

  // 表格
  const data = ref([]) // 表格模型数据
  const tableRef = ref() // 表格的引用
  const selectRows = ref([]) // 选中行
  const { t } = useI18n()
  
  // 表单
  const formVisible = ref(false) // 表单是否显示
  const handleType = ref() // 表单类型
  const row = ref() // 表单数据

  const columns = computed(() => [
    { prop: 'name', label: '名称', type: 'input' },
    { prop: 'description', label: '描述', type: 'textarea' },
    { prop: 'created_at', label: '创建时间', type: 'datetime' },
    { prop: 'updated_at', label: '更新时间', type: 'datetime' },
    {
        type: 'operation',
        fixed: 'right',
        align: 'center',
        buttons: [
          { label: t('common.edit'), icon: 'edit', onClick: (row) => openForm('edit', row) },
          { label: t('common.detail'), icon: 'document', onClick: (row) => openForm('detail', row)},
          { label: t('common.del'), icon: 'delete', type: 'danger', onClick: (row) => del([row]) }
        ]
      }
  ])
  
  // 表格单元格样式
  function cellStyle({ row, column }) {
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
    deleteMaterialTag(rows[0].id).then((response) => {
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
  