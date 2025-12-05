<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      selection="multiple"
      :columns="columns"
      :fetch-data="getSpuList"
      v-model:data="data"
    >
      <template #right-action>
        <el-button type="primary" @click="openForm('add')" icon="plus">新增 SPU</el-button>
      </template>
    </m-table>

    <el-dialog :title="handleType && $t('common.' + handleType)" v-model="formVisible" draggable destroy-on-close append-to-body :close-on-click-modal="false" width="60%">
      <spu-form :handle-type="handleType" :model-value="row" @close="formClose" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import MTable from '@/components/table/index.vue'
import { reactive, ref, computed, defineAsyncComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import type { CommonTableColumn } from '@/components/interface/table'
import type { ProductSpu } from '@/api/product/spu.d'
import { getSpuList, deleteSpu } from '@/api/product/spu'
import { ElImage } from 'element-plus'
import { getUploadFileUrl } from '@/utils/file'

const SpuForm = defineAsyncComponent(() => import('./form.vue'))

const data = ref<ProductSpu[]>([])
const tableRef = ref()
const formVisible = ref(false)
const handleType = ref<string>()
const row = ref<ProductSpu>()
const router = useRouter()

function openForm(type: string, r?: ProductSpu) {
  handleType.value = type
  row.value = r
  formVisible.value = true
}
function formClose(refresh?: boolean) {
  formVisible.value = false
  if (refresh) tableRef.value?.fetchQuery?.()
}

const columns = computed((): CommonTableColumn<ProductSpu>[] => [
  { prop: 'id', label: 'ID', width: 160 },
  { label: '主图', width: 100, align: 'center', slots: { default: ({ row }: any) => {
    const url = row.main_material?.file_path ? getUploadFileUrl(row.main_material.file_path) : ''
    return h(ElImage, { src: url, style: 'width:40px;height:40px; object-fit:cover', fit: 'cover', previewSrcList: url ? [url] : [] })
  } } },
  { prop: 'name', label: '名称', width: 220 },
  { prop: 'sub_title', label: '副标题', width: 260 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'created_at', label: '创建时间', width: 160 },
  { prop: 'updated_at', label: '更新时间', width: 160 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    width: 220,
    buttons: [
      { label: '编辑', icon: 'edit', onClick: (r: ProductSpu) => openForm('edit', r) },
      { label: '详情', icon: 'document', onClick: (r: ProductSpu) => openForm('detail', r) },
      { label: 'SKU管理', icon: 'setting', onClick: (r: ProductSpu) => router.push({ path: `/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/mall-manager/sku-manager`, query: { spuId: r.id } }) },
      { label: '删除', icon: 'delete', type: 'danger', onClick: async (r: ProductSpu) => { await deleteSpu(r.id); tableRef.value?.fetchQuery?.() } }
    ]
  }
])
</script>

<style scoped>
.root { padding: 12px; }
</style>


