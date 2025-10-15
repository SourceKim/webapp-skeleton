<template>
  <div class='root'>
    <m-table
      class='m-table'
      ref='tableRef'
      is-filter-table
      row-key='id'
      selection='multiple'
      :filter-param="filterParam"
      :columns="columns"
      :fetch-data="getProducts"
      @selection-change='(rows) => (selectRows = rows)'
      v-model:data="data"
    >
      <template #right-action>
        <el-button type='primary' @click="openForm('add')" icon='plus'>新增</el-button>
      </template>
    </m-table>

    <el-dialog :title="handleType && $t('common.' + handleType)" v-model="formVisible" draggable destroy-on-close append-to-body :close-on-click-modal="false" width="50%">
      <product-form :handle-type="handleType" :model-value="row" @close="formClose" />
    </el-dialog>
  </div>
 </template>

<script setup lang='ts'>
import MTable from '@/components/table/index.vue'
import { reactive, ref, computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CommonTableColumn } from '@/components/interface/table'
import type { Product } from '@/api/product/product.d'
import { getProducts, deleteProduct } from '@/api/product/product'
const ProductForm = defineAsyncComponent(() => import('./form.vue'))

const data = ref<Product[]>([])
const tableRef = ref()
const filterParam = reactive({})
const selectRows = ref<Product[]>([])
const { t } = useI18n()

const formVisible = ref(false)
const handleType = ref<string>()
const row = ref<Product>()

function openForm(type: string, r?: Product) {
  handleType.value = type
  row.value = r
  formVisible.value = true
}

function formClose(refresh?: boolean) {
  formVisible.value = false
  if (refresh) tableRef.value?.fetchQuery?.()
}

async function del(rows: Product[]) {
  if (!rows.length) return
  await Promise.all(rows.map(r => deleteProduct(r.id)))
  tableRef.value?.fetchQuery?.()
}

const columns = computed((): CommonTableColumn<Product>[] => [
  { prop: 'id', label: 'ID', width: 160 },
  { prop: 'name', label: '名称', width: 180 },
  { prop: 'price', label: '价格', width: 120 },
  { prop: 'stock', label: '库存', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'created_at', label: '创建时间', width: 160 },
  { prop: 'updated_at', label: '更新时间', width: 160 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    width: 200,
    buttons: [
      { label: t('common.edit'), icon: 'edit', onClick: (r: Product) => openForm('edit', r) },
      { label: t('common.detail'), icon: 'document', onClick: (r: Product) => openForm('detail', r) },
      { label: t('common.del'), icon: 'delete', type: 'danger', onClick: (r: Product) => del([r]) }
    ]
  }
])
</script>

<style lang='scss' scoped>
.root {
  padding: 12px;
}
</style>


