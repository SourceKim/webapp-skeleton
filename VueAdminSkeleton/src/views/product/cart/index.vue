<template>
  <div class="page-cart">
    <el-card>
      <div class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item label="用户ID">
            <el-input v-model="filters.user_id" placeholder="用户ID" style="width: 220px" />
          </el-form-item>
          <el-form-item label="SKU ID">
            <el-input v-model="filters.sku_id" placeholder="SKU ID" style="width: 220px" />
          </el-form-item>
          <el-form-item label="选中">
            <el-select v-model="filters.selected" placeholder="全部" style="width: 120px">
              <el-option :value="''" label="全部" />
              <el-option :value="'true'" label="已选中" />
              <el-option :value="'false'" label="未选中" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="load(true)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="items" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" show-overflow-tooltip />
        <el-table-column label="用户" width="240">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;">
              <el-avatar :size="32" :src="getAvatar(row.user)" style="flex-shrink:0;margin-right:10px;">{{ (row.user?.username||'U').charAt(0).toUpperCase() }}</el-avatar>
              <div>
                <div>{{ row.user?.username || row.user_id }}</div>
                <div class="sub">{{ row.user?.phone || row.user?.email || '-' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div style="display:flex;">
              <el-image 
                :src="getSkuImg(row.sku)" 
                style="width:50px;height:50px;border-radius:4px;flex-shrink:0;margin-right:10px;background:#f5f5f5;" 
                fit="cover" 
                :preview-src-list="getSkuImgList(row.sku)"
                preview-teleported
              />
              <div>
                <div class="ellipsis">{{ row.sku?.spu?.name || row.sku?.sku_name || '商品' }}</div>
                <div class="sub">{{ getSpecs(row.sku) }}</div>
                <div class="sub" style="color:#fa2c19;">{{ row.sku?.price ? '￥'+Number(row.sku.price).toFixed(2) : '-' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column prop="selected" label="选中" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.selected ? 'success' : 'info'" size="small">{{ row.selected ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="170" align="center" />
      </el-table>
      <div class="pager">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10,20,50]"
          :page-size="limit"
          :current-page="page"
          :total="total"
          @size-change="(s:number)=>{ limit=s; load(true) }"
          @current-change="(p:number)=>{ page=p; load() }"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listAdminCarts, type CartItemDTO } from '@/api/cart'
import { getUploadFileUrl } from '@/utils/file'

const items = ref<CartItemDTO[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const filters = ref<{ user_id?: string; sku_id?: string; selected?: ''|'true'|'false' }>({ selected: '' })

async function load(reset = false) {
  if (reset) page.value = 1
  loading.value = true
  try {
    const resp = await listAdminCarts({ page: page.value, limit: limit.value, filters: cleanupFilters(filters.value) })
    if ((resp as any).code === 0) {
      items.value = (resp as any).data.items
      total.value = (resp as any).data.meta.total
    }
  } finally {
    loading.value = false
  }
}

function cleanupFilters(f: any) {
  const o: any = {}
  if (f.user_id) o.user_id = f.user_id
  if (f.sku_id) o.sku_id = f.sku_id
  if (f.selected === 'true') o.selected = true
  if (f.selected === 'false') o.selected = false
  return o
}

function getAvatar(u: any) {
  if (!u?.avatar) return ''
  return getUploadFileUrl(u.avatar)
}

function getSkuImg(sku: any) {
  const path = sku?.spu?.main_material?.file_path
  return path ? getUploadFileUrl(path) : ''
}

function getSkuImgList(sku: any) {
  const url = getSkuImg(sku)
  return url ? [url] : []
}

function getSpecs(sku: any) {
  if (!sku) return '-'
  const attrs = sku.sku_attributes || []
  if (attrs.length > 0) {
    return attrs.map((a: any) => `${a.attribute_key?.name || ''}:${a.attribute_value?.value || ''}`).join('; ')
  }
  return sku.sku_code || '-'
}

onMounted(() => load(true))
</script>

<style scoped>
.toolbar { margin-bottom: 12px }
.pager { display: flex; justify-content: flex-end; padding: 12px 0 }
.sub { color: #999; font-size: 12px; line-height: 1.4; }
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
</style>


