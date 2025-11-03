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
        <el-table-column prop="id" label="ID" width="200" />
        <el-table-column label="用户" width="220">
          <template #default="{ row }">{{ row.user?.id || row.user_id }}</template>
        </el-table-column>
        <el-table-column label="SKU" min-width="260">
          <template #default="{ row }">
            <div> {{ row.sku?.sku_name || row.sku?.id }} </div>
            <div class="sub">{{ row.sku?.sku_code }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="selected" label="选中" width="100">
          <template #default="{ row }">
            <el-tag :type="row.selected ? 'success' : 'info'">{{ row.selected ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
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

onMounted(() => load(true))
</script>

<style scoped>
.toolbar { margin-bottom: 12px }
.pager { display: flex; justify-content: flex-end; padding: 12px 0 }
.sub { color: #999; font-size: 12px }
</style>


