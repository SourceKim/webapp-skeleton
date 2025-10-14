<template>
    <div class="root">
      <!-- 表格描述 -->
      <m-table
        class="m-table"
        ref="tableRef"
        is-filter-table
        is-complex-filter
        row-key="id"
        :filter-param="filterParam"
        :filter-columns="filterColumns"
        :columns="columns"
        :fetch-data="getUserList"
        selection="multiple"
        @selection-change="(rows: any[]) => (selectRows = rows)"
        v-model:data="data"
      >
        <!-- 表格右侧操作按钮（add & delete） -->
        <template #right-action>
          <el-button type="primary" icon="plus" @click="openForm('add', null)">{{ $t('common.add') }}</el-button>
          <el-button type="danger" icon="delete" :disabled="selectRows.length === 0" @click="del(selectRows)">{{ $t('common.del') }}</el-button>
        </template>
      </m-table>

      <!-- 新增/编辑 页面 -->
      <el-dialog
        :title="handleType && $t('comp.operation.' + handleType)"
        v-model="formVisible"
        draggable
        destroy-on-close
        append-to-body
        :close-on-click-modal="false"
        width="50%"
      >
        <user-form :handle-type="handleType" :model-value="row" @close="close" style="height: 60vh" />
      </el-dialog>
    </div>
  </template>
  <script setup lang="tsx">
  import type { Ref } from 'vue'
  import { computed, reactive, ref } from 'vue'
  import { delUserByIds } from '@/api/user/user'
  import UserForm from './userForm.vue'
  import { useI18n } from 'vue-i18n'
  import { getUserList } from '@/api/user/user'
  import type { FormHandleType } from '@/components/interface/form'
  import type { CommonTableColumn } from '@/components/interface/table'
  import mTable from '@/components/table/index.vue'
  import { ElButton } from 'element-plus'

  
  const { t } = useI18n()
  const tableRef = ref()
  const data = ref([])
  const selectRows = ref<any[]>([])
  
  const filterParam = reactive({})
  
  const columns: Ref<CommonTableColumn<any>[]> = computed(() => [
    { type: 'index', width: 90 },
    { prop: 'id', label: 'Id', width: 90 },
    { prop: 'username', label: t('view.user.username') },
    { prop: 'bio', label: t('view.user.bio') },
    { prop: 'email', label: t('view.user.email') },
    { prop: 'nickname', label: t('view.user.nickname') },
    { prop: 'phone', label: t('view.user.phone') },
    { prop: 'status', label: t('common.status') },
    { prop: 'created_at', label: t('common.createdAt') },
    { prop: 'updated_at', label: t('common.updatedAt') },
    {
      type: 'operation',
      fixed: 'right',
      align: 'center',
      buttons: [
        { label: t('view.user.edit'), icon: 'edit', onClick: (row: any) => openForm('edit', row) },
        { label: t('view.user.detail'), icon: 'document', onClick: (row: any) => openForm('detail', row)},
        { label: t('view.user.del'), icon: 'delete', type: 'danger', onClick: (row: any) => del([row]) }
      ]
    }
  ])

  const filterColumns = computed(() => [
    { prop: 'username', label: t('view.user.username') },
  ])
  
  const formVisible = ref(false)
  const handleType = ref<FormHandleType>()
  const row = ref()
  
  function openForm(type: FormHandleType, r: any) {
    row.value = r
    formVisible.value = true
    handleType.value = type
  }
  
  function del(rows: any []) {
    delUserByIds(rows.map((i) => i.id), {
      showLoading: true,
      showBeforeConfirm: true,
      showSuccessMsg: true,
      confirmMsg: t('common.confirmDelete')
    }).then(() => {
      tableRef.value.fetchQuery()
    })
  }
  
  function close(type: string) {
    formVisible.value = false
    // 如果关闭 form 时，传入的类型为refresh，则刷新表格
    if (type === 'refresh') {
      tableRef.value.fetchQuery()
    }
  }
  
  </script>
  <style lang="scss" scoped>
  .m-table {
    height: 100%;
  }
  </style>
  