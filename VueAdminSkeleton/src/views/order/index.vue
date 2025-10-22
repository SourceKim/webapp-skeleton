<template>
  <div class="order-page">
    <el-form :inline="true" size="small" class="toolbar" @submit.prevent>
      <el-form-item label="用户ID">
        <el-input v-model="query.filters.user_id" placeholder="用户ID" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.filters.status" placeholder="全部" clearable style="width: 140px">
          <el-option v-for="s in statuses" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="fetchList(true)">查询</el-button>
    </el-form>

    <el-table :data="items" border style="width: 100%">
      <el-table-column prop="id" label="订单ID" width="220" />
      <el-table-column prop="user_id" label="用户ID" width="180" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="total_price" label="总金额" width="120">
        <template #default="{ row }">￥{{ formatPrice(row.total_price) }}</template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button v-if="row.status==='confirmed'" size="small" type="primary" @click="openShip(row)">发货</el-button>
          <el-button size="small" @click="view(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination
        background
        layout="prev, pager, next, jumper, total"
        :total="total"
        :page-size="query.limit"
        :current-page="query.page"
        @current-change="(p:number)=>{ query.page=p; fetchList() }"
      />
    </div>

    <el-dialog v-model="shipVisible" title="订单发货" width="420">
      <el-form label-width="90px">
        <el-form-item label="物流单号">
          <el-input v-model="shippingNo" placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipVisible=false">取消</el-button>
        <el-button type="primary" :loading="shipping" @click="doShip">确认发货</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="detailVisible" title="订单详情" size="60%">
      <div v-if="detail" class="detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ detail.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ detail.user_id }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detail.status }}</el-descriptions-item>
          <el-descriptions-item label="总金额">￥{{ formatPrice(detail.total_price) }}</el-descriptions-item>
          <el-descriptions-item label="地址" :span="2">{{ detail.address || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物流单号" :span="2">{{ detail.shipping_no || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detail.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.created_at }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ detail.updated_at }}</el-descriptions-item>
        </el-descriptions>

        <div style="margin: 12px 0 6px; font-weight: 600;">商品明细</div>
        <el-table :data="detail.items || []" border>
          <el-table-column prop="product.name" label="商品" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="单价" width="120">
            <template #default="{ row }">￥{{ formatPrice(row.unit_price) }}</template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">￥{{ formatPrice(Number(row.unit_price) * Number(row.quantity)) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listAdminOrders, shipOrder, type OrderDTO, type OrderStatus } from '@/api/order'

const items = ref<OrderDTO[]>([])
const total = ref(0)
const query = reactive({ page: 1, limit: 10, sort_by: 'created_at', sort_order: 'DESC' as 'DESC', filters: { user_id: '', status: '' as '' | OrderStatus } })

const statuses = [
  { label: '全部', value: '' },
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'canceled' }
]

const formatPrice = (v: number) => {
  try { return Number(v).toFixed(2) } catch { return String(v) }
}

const fetchList = async (reset = false) => {
  if (reset) { query.page = 1 }
  const { items: list, meta } = (await listAdminOrders(query as any))?.data || { items: [], meta: { total: 0 } }
  items.value = list || []
  total.value = meta?.total || 0
}

const shipVisible = ref(false)
const current = ref<OrderDTO | null>(null)
const shippingNo = ref('')
const shipping = ref(false)
const detailVisible = ref(false)
const detail = ref<OrderDTO | null>(null)

const openShip = (row: OrderDTO) => { current.value = row; shippingNo.value = row.shipping_no || ''; shipVisible.value = true }
const doShip = async () => {
  if (!current.value) return
  if (!shippingNo.value) { ElMessage.error('请输入物流单号'); return }
  shipping.value = true
  const resp = await shipOrder(current.value.id, shippingNo.value)
  shipping.value = false
  if (resp?.code === 0) {
    ElMessage.success('发货成功')
    shipVisible.value = false
    fetchList()
  } else {
    ElMessage.error(resp?.message || '操作失败')
  }
}

const view = (row: OrderDTO) => {
  detail.value = row
  detailVisible.value = true
}

onMounted(() => { fetchList(true) })
</script>

<style scoped>
.order-page { padding: 16px; }
.toolbar { margin-bottom: 12px; }
.pager { margin-top: 12px; display: flex; justify-content: flex-end; }
.detail { padding-right: 8px; }
</style>


