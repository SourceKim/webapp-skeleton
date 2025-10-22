<template>
  <view class="order-detail">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="!order" class="empty">订单不存在</view>
    <view v-else>
      <view class="status-box">
        <text class="label">订单状态：</text>
        <text class="status">{{ order.status }}</text>
      </view>

      <view class="progress">
        <view class="step" :class="{ done: isStepDone('pending') }">创建</view>
        <view class="step" :class="{ done: isStepDone('confirmed') }">已确认</view>
        <view class="step" :class="{ done: isStepDone('shipped') }">已发货</view>
        <view class="step" :class="{ done: isStepDone('completed') }">已完成</view>
      </view>

      <view class="items">
        <view class="item" v-for="it in order.items || []" :key="it.id">
          <text class="name">{{ it.product?.name || '商品' }}</text>
          <text class="qty">x{{ it.quantity }}</text>
          <text class="price">￥{{ formatPrice(it.unit_price) }}</text>
        </view>
      </view>

      <view class="summary">
        <text>合计：￥{{ formatPrice(order.total_price) }}</text>
      </view>

      <view class="actions">
        <button v-if="order.status==='pending'" class="btn primary" size="mini" @tap="confirm">确认/支付</button>
        <button v-if="order.status==='pending'" class="btn danger" size="mini" @tap="cancel">取消订单</button>
        <button v-if="order.status==='shipped'" class="btn primary" size="mini" @tap="complete">确认收货</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
</style>


