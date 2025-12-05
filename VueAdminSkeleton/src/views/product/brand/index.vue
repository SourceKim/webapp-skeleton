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
      :fetch-data="getBrands"
      @selection-change='(rows) => (selectRows = rows)'
      v-model:data="data"
    >
      <template #right-action>
        <el-button type='primary' @click="openForm('add')" icon='plus'>新增品牌</el-button>
      </template>
    </m-table>

    <el-dialog :title="handleType && $t('common.' + handleType)" v-model="formVisible" draggable destroy-on-close append-to-body :close-on-click-modal="false" width="50%">
      <brand-form :handle-type="handleType" :model-value="row" @close="formClose" />
    </el-dialog>
  </div>
 </template>

<script setup lang='ts'>
import MTable from '@/components/table/index.vue'
import { reactive, ref, computed, defineAsyncComponent, h } from 'vue'
import { ElImage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { CommonTableColumn } from '@/components/interface/table'
import type { ProductBrand } from '@/api/product/brand.d'
import { getBrands, deleteBrand } from '@/api/product/brand'
import { getUploadFileUrl } from '@/utils/file'

const BrandForm = defineAsyncComponent(() => import('./form.vue'))
const data = ref<ProductBrand[]>([])
const tableRef = ref()
const filterParam = reactive({})
const selectRows = ref<ProductBrand[]>([])
const { t } = useI18n()

const formVisible = ref(false)
const handleType = ref<string>()
const row = ref<ProductBrand>()

function openForm(type: string, r?: ProductBrand) {
  handleType.value = type
  row.value = r
  formVisible.value = true
}

function formClose(refresh?: boolean) {
  formVisible.value = false
  if (refresh) tableRef.value?.fetchQuery?.()
}

async function del(rows: ProductBrand[]) {
  if (!rows.length) return
  await Promise.all(rows.map(r => deleteBrand(r.id)))
  tableRef.value?.fetchQuery?.()
}

const columns = computed((): CommonTableColumn<ProductBrand>[] => [
  { prop: 'id', label: 'ID', width: 160 },
  {
    label: 'Logo', width: 100, align: 'center', slots: {
      default: ({ row }: any) => {
        const url = row.material?.file_path ? getUploadFileUrl(row.material.file_path) : ''
        if (!url) return h('span', '-')
        return h(ElImage, { src: url, style: 'width:40px;height:40px; object-fit:cover', fit: 'cover', previewSrcList: [url], previewTeleported: true })
      }
    }
  },
  { prop: 'name', label: '名称', width: 200 },
  { prop: 'description', label: '描述', width: 240 },
  { prop: 'website', label: '官网', width: 200, formatter: (row) => row.website || '-' },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'created_at', label: '创建时间', width: 160 },
  { prop: 'updated_at', label: '更新时间', width: 160 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    width: 200,
    buttons: [
      { label: t('common.edit'), icon: 'edit', onClick: (r: ProductBrand) => openForm('edit', r) },
      { label: t('common.detail'), icon: 'document', onClick: (r: ProductBrand) => openForm('detail', r) },
      { label: t('common.del'), icon: 'delete', type: 'danger', onClick: (r: ProductBrand) => del([r]) }
    ]
  }
])
</script>

<style lang='scss' scoped>
.root {
  padding: 12px;
}
</style>


