<template>
  <view class="order-list">
    <scroll-view class="list" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
      <nut-empty v-if="!loading && orders.length === 0" description="暂无订单" />
      <nut-card v-for="o in orders" :key="o.id" class="card" @click="goDetail(o.id)">
        <template #header>
          <view class="row">
            <nut-tag :type="statusType(o.status)" plain>{{ statusText(o.status) }}</nut-tag>
            <text class="total">￥{{ formatPrice(o.total_price) }}</text>
          </view>
        </template>
        <template #content>
          <view class="content-row">
            <image class="thumb" :src="orderThumb(o)" mode="aspectFill" />
            <view class="meta">
              <text class="title">{{ orderTitle(o) }}</text>
              <text class="sub">{{ o.created_at }}</text>
            </view>
          </view>
        </template>
        <template #footer>
          <view class="actions">
            <nut-button size="small" type="primary" plain @click.stop="goDetail(o.id)">查看详情</nut-button>
          </view>
        </template>
      </nut-card>
      <view class="loading" v-if="loading">加载中...</view>
      <view class="no-more" v-else-if="!hasMore">没有更多了</view>
    </scroll-view>
  </view>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import orderService, { type Order, type OrderStatus } from '../../../services/order'
import productService, { getMaterialUrl } from '../../../services/product'

const orders = ref<Order[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)
const thumbMap = ref<Record<string, string>>({})
const defaultThumb = 'https://dummyimage.com/160x120/eaeaea/999.png&text=No+Image'

const fetchList = async (reset = false) => {
  if (loading.value) return
  loading.value = true
  if (reset) { page.value = 1; orders.value = []; hasMore.value = true }
  const resp = await orderService.getMyOrders({ page: page.value, limit: limit.value })
  loading.value = false
  if (resp.code === 0 && resp.data) {
    const { items, meta } = resp.data
    total.value = meta.total
    orders.value = orders.value.concat(items)
    page.value += 1
    hasMore.value = orders.value.length < total.value
    // 预取前若干商品缩略图，避免过多并发
    preloadThumbs(items)
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

const loadMore = () => { if (!hasMore.value || loading.value) return; fetchList() }
const formatPrice = (price: number) => { try { return Number(price).toFixed(2) } catch { return String(price) } }
const statusText = (s: OrderStatus) => ({ pending: '待支付', confirmed: '已确认', shipped: '已发货', completed: '已完成', canceled: '已取消' }[s] || s)
const statusType = (s: OrderStatus): 'primary' | 'success' | 'warning' | 'danger' | 'default' => {
  switch (s) {
    case 'pending':
      return 'warning'
    case 'confirmed':
      return 'primary'
    case 'shipped':
      return 'primary'
    case 'completed':
      return 'success'
    case 'canceled':
      return 'danger'
    default:
      return 'default'
  }
}
const firstProductId = (o: Order): string | undefined => o.items?.find(i => !!i.product_id)?.product_id || undefined
const orderTitle = (o: Order): string => {
  const first = o.items?.[0]
  const name = first?.product?.name || '商品'
  const count = o.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0
  return count > 1 ? `${name} 等 ${count} 件` : name
}
const orderThumb = (o: Order): string => {
  const pid = firstProductId(o)
  if (!pid) return defaultThumb
  return thumbMap.value[pid] || defaultThumb
}
const preloadThumbs = async (ordersChunk: Order[]) => {
  const ids: string[] = []
  for (const o of ordersChunk) {
    const pid = firstProductId(o)
    if (pid && !thumbMap.value[pid] && !ids.includes(pid)) ids.push(pid)
    if (ids.length >= 6) break
  }
  for (const pid of ids) {
    try {
      const resp = await productService.getProduct(pid)
      if (resp.code === 0 && resp.data) {
        const fp = resp.data.materials?.find(m => m.type === 'image')?.file_path || resp.data.materials?.[0]?.file_path
        const url = getMaterialUrl(fp) || defaultThumb
        thumbMap.value = { ...thumbMap.value, [pid]: url }
      }
    } catch {}
  }
}
const goDetail = (id: string) => {
  const url = `/pages/mall/order-detail/index?id=${id}`
  console.log('[order-list] goDetail click', { id, env: Taro.getEnv(), url, href: typeof window !== 'undefined' ? window.location.href : '' })
  Taro.navigateTo({ url })
    .then(() => {
      console.log('[order-list] navigateTo resolved', { href: typeof window !== 'undefined' ? window.location.href : '' })
    })
    .catch((err) => {
      console.error('[order-list] navigateTo failed, fallback to redirectTo', err)
      return Taro.redirectTo({ url })
        .then(() => console.log('[order-list] redirectTo resolved', { href: typeof window !== 'undefined' ? window.location.href : '' }))
        .catch((e) => console.error('[order-list] redirectTo failed', e))
    })
}

onMounted(() => { fetchList(true) })
</script>

<style lang="scss">
.order-list { padding: 0; }
.list { height: calc(100vh - 100px); padding: 12px; }
.card { margin-bottom: 12px; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.total { color: #333; font-weight: 600; font-size: 16px; }
.content-row { display: flex; gap: 10px; }
.thumb { width: 80px; height: 60px; background: #f2f2f2; border-radius: 6px; }
.meta { display: flex; flex-direction: column; justify-content: space-between; }
.title { color: #333; font-size: 14px; font-weight: 500; }
.sub { color: #999; font-size: 12px; }
.actions { display: flex; justify-content: flex-end; }
.loading, .no-more { text-align: center; color: #999; padding: 12px 0; }
</style>


