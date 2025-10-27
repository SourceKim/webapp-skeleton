<template>
  <view class="order-detail">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="!order" class="empty">订单不存在</view>
    <view v-else>
      <view class="status-box">
        <text class="label">订单状态：</text>
        <text class="status">{{ statusText(order.status) }}</text>
      </view>

      <nut-steps :current="currentStep" progress-dot>
        <nut-step>创建</nut-step>
        <nut-step>已确认</nut-step>
        <nut-step>已发货</nut-step>
        <nut-step>已完成</nut-step>
      </nut-steps>

      <view class="items">
        <nut-card
          v-for="it in order.items || []"
          :key="it.id"
          class="card"
          :img-url="firstImageUrl(it.product)"
          :title="it.product?.name || '商品'"
          :is-need-price="false"
        >
          <template #shop-tag>
            <view class="meta">
              <text class="sub">数量：x{{ it.quantity }}</text>
              <text class="sub">单价：￥{{ formatPrice(it.unit_price) }}</text>
              <text class="sub">总价：￥{{ formatPrice(Number(it.unit_price) * Number(it.quantity)) }}</text>
            </view>
          </template>
        </nut-card>
      </view>

      <view class="summary">
        <nut-price :price="order.total_price" :decimal-digits="2" thousands />
      </view>

      <view class="actions">
        <nut-button v-if="order.status==='pending'" type="primary" size="small" @click="confirm">确认/支付</nut-button>
        <nut-button v-if="order.status==='pending'" type="danger" size="small" plain @click="cancel">取消订单</nut-button>
        <nut-button v-if="order.status==='shipped'" type="primary" size="small" @click="complete">确认收货</nut-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'
import orderService, { type Order, type OrderStatus } from '../../../services/order'

const router = useRouter()
const id = (router.params?.id as string) || ''
const order = ref<Order | null>(null)
const loading = ref(false)

const fetchDetail = async () => {
  if (!id) return
  loading.value = true
  const resp = await orderService.getMyOrder(id)
  loading.value = false
  if (resp.code === 0 && resp.data) {
    order.value = resp.data
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

const isStepDone = (step: OrderStatus) => {
  const rank: Record<OrderStatus, number> = { pending: 0, confirmed: 1, shipped: 2, completed: 3, canceled: -1 }
  return (order.value?.status ? rank[order.value.status] : -2) >= rank[step]
}

const formatPrice = (price: number) => { try { return Number(price).toFixed(2) } catch { return String(price) } }

const statusText = (s: OrderStatus | undefined) => ({ pending: '待支付', confirmed: '已确认', shipped: '已发货', completed: '已完成', canceled: '已取消' }[s || 'pending'])
const currentStep = computed(() => {
  const m: Record<OrderStatus, number> = { pending: 0, confirmed: 1, shipped: 2, completed: 3, canceled: 0 }
  const s = order.value?.status || 'pending'
  return m[s]
})

const confirm = async () => {
  if (!id) return
  const resp = await orderService.confirmOrder(id)
  if (resp.code === 0 && resp.data) { order.value = resp.data } else { Taro.showToast({ title: resp.message || '操作失败', icon: 'none' }) }
}
const cancel = async () => {
  if (!id) return
  const resp = await orderService.cancelOrder(id)
  if (resp.code === 0 && resp.data) { order.value = resp.data } else { Taro.showToast({ title: resp.message || '操作失败', icon: 'none' }) }
}
const complete = async () => {
  if (!id) return
  const resp = await orderService.completeOrder(id)
  if (resp.code === 0 && resp.data) { order.value = resp.data } else { Taro.showToast({ title: resp.message || '操作失败', icon: 'none' }) }
}

onMounted(() => {
  console.log('[order-detail] fetch', { id })
  fetchDetail()
})

const defaultThumb = 'https://dummyimage.com/160x120/eaeaea/999.png&text=No+Image'
const BASE_FILE_URL = (Taro as any).env?.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/'
const firstImageUrl = (p?: Order['items'][number]['product'] | null): string => {
  try {
    const mats = (p?.materials as any[]) || []
    if (mats.length > 0) {
      const img = mats.find(m => m?.type === 'image') || mats[0]
      const fp = img?.file_path as string | undefined
      if (fp) {
        const base = String(BASE_FILE_URL)
        return base.replace(/\/+$/, '/') + String(fp).replace(/^\/+/, '')
      }
    }
  } catch {}
  return defaultThumb
}
</script>

<style lang="scss">
.order-detail {
  padding: 12px;
}
.loading, .empty { padding: 24px; text-align: center; color: #999; }
.status-box { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; .label { color: #666; } .status { color: #333; font-weight: 600; } }
.progress { display: flex; gap: 8px; margin: 12px 0; .step { flex: 1; text-align: center; padding: 8px; background: #f5f5f5; border-radius: 6px; &.done { background: #e6f7ff; color: #1677ff; font-weight: 600; } } }
.items { background: #fff; border-radius: 8px; overflow: hidden; .item { display: flex; padding: 10px 12px; border-bottom: 1px solid #f5f5f5; .name { flex: 1; } .qty { width: 60px; text-align: right; color: #666; } .price { width: 80px; text-align: right; color: #e64a19; } } }
.summary { text-align: right; padding: 12px; color: #333; font-weight: 600; }
.actions { display: flex; gap: 8px; padding: 12px; position: fixed; left: 0; right: 0; bottom: calc(env(safe-area-inset-bottom) + 12px); justify-content: center; }
.btn { padding: 6px 12px; border-radius: 4px; &.primary { background: #1677ff; color: #fff; } &.danger { background: #ff4d4f; color: #fff; } }
.meta { display: flex; flex-direction: column; gap: 4px; font-size: small; }
</style>


