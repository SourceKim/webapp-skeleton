<template>
  <div class="page-order">
    <el-card>
      <div class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item label="订单号">
            <el-input v-model="filters.id" placeholder="订单号" style="width: 180px" />
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input v-model="filters.user_id" placeholder="用户ID" style="width: 180px" />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="filters.order_status" placeholder="全部" style="width: 120px" clearable>
              <el-option value="PENDING" label="待处理" />
              <el-option value="CONFIRMED" label="已确认" />
              <el-option value="CANCELED" label="已取消" />
              <el-option value="COMPLETED" label="已完成" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态">
            <el-select v-model="filters.payment_status" placeholder="全部" style="width: 120px" clearable>
              <el-option value="UNPAID" label="未支付" />
              <el-option value="PAID" label="已支付" />
              <el-option value="REFUNDED" label="已退款" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="load(true)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="items" stripe style="width: 100%" v-loading="loading" row-key="id">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div style="padding: 10px 20px; background: #f9f9f9;">
              <el-descriptions title="收货信息" :column="3" size="small" border>
                <el-descriptions-item label="收货人">{{ row.address_snapshot?.name }} {{ row.address_snapshot?.phone }}</el-descriptions-item>
                <el-descriptions-item label="地址">{{ row.address_snapshot?.province }}{{ row.address_snapshot?.city }}{{ row.address_snapshot?.detail }}</el-descriptions-item>
                <el-descriptions-item label="备注">{{ row.remark || '-' }}</el-descriptions-item>
              </el-descriptions>
              <div style="margin-top: 10px; font-weight: bold;">商品清单</div>
              <el-table :data="row.items || []" size="small" border style="margin-top: 5px;">
                <el-table-column label="商品图" width="60">
                  <template #default="{ row: item }">
                    <el-image 
                      :src="getSkuImg(item)" 
                      style="width: 40px; height: 40px; border-radius: 4px;" 
                      fit="cover" 
                      preview-teleported
                      :preview-src-list="getSkuImgList(item)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" min-width="200">
                  <template #default="{ row: item }">
                    <div>{{ item.sku_snapshot?.spu?.name || item.sku_snapshot?.sku_name }}</div>
                    <div style="color: #999; font-size: 12px;">{{ getSpecs(item) }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="unit_price" label="单价" width="100" />
                <el-table-column prop="quantity" label="数量" width="80" />
                <el-table-column prop="total_price" label="小计" width="100" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="订单号" width="180" show-overflow-tooltip />
        <el-table-column label="用户" width="180">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;">
              <el-avatar :size="24" :src="getAvatar(row.user)" style="margin-right:8px; flex-shrink: 0;">{{ (row.user?.username||'U').charAt(0) }}</el-avatar>
              <span class="ellipsis">{{ row.user?.username || row.user_id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payable_amount" label="实付金额" width="120" sortable="custom">
          <template #default="{ row }">
            <span style="color: #fa2c19; font-weight: 600;">¥{{ row.payable_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.order_status==='PENDING'" type="warning">待处理</el-tag>
            <el-tag v-else-if="row.order_status==='CONFIRMED'" type="primary">已确认</el-tag>
            <el-tag v-else-if="row.order_status==='COMPLETED'" type="success">已完成</el-tag>
            <el-tag v-else type="info">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.payment_status==='PAID'" type="success" effect="plain">已支付</el-tag>
            <el-tag v-else-if="row.payment_status==='REFUNDED'" type="danger" effect="plain">已退款</el-tag>
            <el-tag v-else type="info" effect="plain">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发货" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.delivery_status==='SHIPPED'" type="primary" effect="dark">已发货</el-tag>
            <el-tag v-else-if="row.delivery_status==='DELIVERED'" type="success" effect="dark">已送达</el-tag>
            <el-tag v-else type="info" effect="dark">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" width="170" sortable="custom" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              v-if="row.delivery_status==='PENDING' && row.order_status!=='CANCELED'" 
              type="primary" 
              size="small" 
              @click="doShip(row)"
            >发货</el-button>
            <el-button 
              v-if="row.order_status==='CONFIRMED' && row.delivery_status==='SHIPPED'" 
              type="success" 
              size="small" 
              @click="doComplete(row)"
            >完成</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 50]"
          :page-size="limit"
          :current-page="page"
          :total="total"
          @size-change="(s) => { limit = s; load(true) }"
          @current-change="(p) => { page = p; load() }"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { listAdminOrders, shipOrder, updateOrderStatus } from '@/api/order'
import type { Order } from '@/api/product/order.d'
import { getUploadFileUrl } from '@/utils/file'
import { ElMessage, ElMessageBox } from 'element-plus'

const items = ref<Order[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const filters = reactive({
  id: '',
  user_id: '',
  order_status: '',
  payment_status: ''
})

async function load(reset = false) {
  if (reset) page.value = 1
  loading.value = true
  try {
    const res: any = await listAdminOrders({ 
      page: page.value, 
      limit: limit.value, 
      filters: cleanup(filters) 
    })
    if (res.code === 0) {
      items.value = (res.data.items || []).map((item: any) => ({
        ...item,
        // 确保数值类型正确，防止表格排序报错
        payable_amount: Number(item.payable_amount).toFixed(2)
      }))
      total.value = res.data.meta.total
    }
  } finally {
    loading.value = false
  }
}

function cleanup(o: any) {
  const res: any = {}
  for (const k in o) {
    if (o[k]) res[k] = o[k]
  }
  return res
}

function getAvatar(u: any) {
  if (!u?.avatar) return ''
  return getUploadFileUrl(u.avatar)
}

function getSkuImg(item: any) {
  const path = item.sku_snapshot?.spu?.main_material?.file_path
  return path ? getUploadFileUrl(path) : ''
}

function getSkuImgList(item: any) {
  const url = getSkuImg(item)
  return url ? [url] : []
}

function getSpecs(item: any) {
  const attrs = item.sku_snapshot?.attributes || []
  if (attrs.length) {
    return attrs.map((a: any) => `${a.key_name||a.key_id}:${a.value||a.value_id}`).join('; ')
  }
  return ''
}

async function doShip(row: Order) {
  try {
    await ElMessageBox.confirm('确认要发货吗？', '提示', { type: 'warning' })
    const res: any = await shipOrder(row.id)
    if (res.code === 0) {
      ElMessage.success('发货成功')
      load()
    }
  } catch {}
}

async function doComplete(row: Order) {
  try {
    await ElMessageBox.confirm('确认订单已完成（用户已收货）？', '提示', { type: 'warning' })
    const res: any = await updateOrderStatus(row.id, 'COMPLETED')
    if (res.code === 0) {
      ElMessage.success('订单已完成')
      load()
    }
  } catch {}
}

onMounted(() => load(true))
</script>

<style scoped>
.toolbar { margin-bottom: 12px; }
.pager { display: flex; justify-content: flex-end; padding: 12px 0; }
.ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>


