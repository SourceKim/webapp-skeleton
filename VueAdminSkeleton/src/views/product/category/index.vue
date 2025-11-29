<template>
  <div class="root">
    <div class="toolbar">
      <el-select v-model="filterBrandId" placeholder="筛选品牌" clearable @change="fetchRoot" style="width: 200px; margin-right: 12px;">
        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" @click="openForm('add')" icon="plus">新增分类</el-button>
    </div>
    <el-table
      :data="rootData"
      row-key="id"
      :lazy="!filterBrandId"
      :load="loadChildren"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="名称" min-width="200" />
      <el-table-column prop="brand_name" label="所属品牌" width="150" />
      <el-table-column label="图片" width="100" align="center">
        <template #default="{ row }">
          <el-image :src="row.image_url" style="width:40px;height:40px;object-fit:cover" :preview-src-list="row.image_url ? [row.image_url] : []" />
        </template>
      </el-table-column>
      <el-table-column prop="level" label="层级" width="80" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="220" align="center">
        <template #default="{ row }">
          <el-button size="small" @click="openForm('edit', row)">编辑</el-button>
          <el-button size="small" @click="openForm('detail', row)">详情</el-button>
          <el-button size="small" type="danger" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="handleType && $t('common.' + handleType)" v-model="formVisible" draggable destroy-on-close append-to-body :close-on-click-modal="false" width="50%">
      <category-form :handle-type="handleType" :model-value="row" @close="formClose" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, nextTick } from 'vue'
import type { ProductCategory } from '@/api/product/category.d'
import type { ProductBrand } from '@/api/product/brand.d'
import { getCategories, deleteCategory } from '@/api/product/category'
import { getBrandsAll } from '@/api/product/brand'

const CategoryForm = defineAsyncComponent(() => import('./form.vue'))

const rootData = ref<ProductCategory[]>([])
const formVisible = ref(false)
const handleType = ref<string>()
const row = ref<ProductCategory>()

const brandList = ref<ProductBrand[]>([])
const filterBrandId = ref<string>()

function openForm(type: string, r?: ProductCategory) {
  handleType.value = type
  row.value = r
  formVisible.value = true
}
function formClose(refresh?: boolean) {
  formVisible.value = false
  if (refresh) fetchRoot()
}

async function fetchRoot() {
  const params: any = {}
  if (filterBrandId.value) {
    // 筛选品牌模式：获取扁平列表
    params.filters = { brand_id: filterBrandId.value }
    params.limit = 1000 // 获取所有
    const res: any = await getCategories(params)
    if (res?.code === 0) {
      // 不设置 hasChildren，显示为扁平列表
      rootData.value = (res.data?.items || [])
    }
  } else {
    // 默认模式：树形懒加载
    params.parent_id = null
    const res: any = await getCategories(params)
    if (res?.code === 0) {
      rootData.value = (res.data?.items || []).map((i: any) => ({ ...i, hasChildren: true }))
    }
  }
}

async function fetchBrands() {
  const res = await getBrandsAll({ limit: 100, status: 'ENABLED' })
  if (res.code === 0) {
    brandList.value = res.data.items
  }
}

async function loadChildren(row: any, treeNode: any, resolve: (data: ProductCategory[]) => void) {
  const parent = row
  const res: any = await getCategories({ parent_id: parent.id })
  const list = (res?.code === 0 ? res.data?.items : []) || []
  resolve(list.map((i: any) => ({ ...i, hasChildren: true })))
}

async function del(r: ProductCategory) {
  await deleteCategory(r.id)
  rootData.value = []
  await nextTick()
  await fetchRoot()
}

onMounted(() => {
  fetchBrands()
  fetchRoot()
})
</script>

<style scoped>
.root { padding: 12px; }
.toolbar { margin-bottom: 12px; }
</style>


