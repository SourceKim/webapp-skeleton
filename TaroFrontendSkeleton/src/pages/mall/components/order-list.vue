<template>
  <view class="order-list">
    <scroll-view class="list" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
      <nut-empty v-if="!loading && orders.length === 0" description="暂无订单" />
      <nut-card
        v-for="o in orders"
        :key="o.id"
        class="card"
        :img-url="firstImageUrl(o)"
        :title="productNames(o)"
        :is-need-price="true"
        @click="goDetail(o.id)"
      >
        <template #shop-tag>
          <view class="meta">
            <text class="sub">订单ID：{{ o.id }}</text>
            <text class="sub">日期：{{ formatDate(o.created_at) }}</text>
            <nut-tag size="small">{{ statusText(o.status) }}</nut-tag>
          </view>
        </template>

        <template #price>
          <nut-price :price="o.total_price" :decimal-digits="2" thousands />
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

const orders = ref<Order[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)
const defaultThumb = 'https://dummyimage.com/160x120/eaeaea/999.png&text=No+Image'
// 小程序端不一定支持 import.meta，优先使用 Taro 环境变量
const BASE_FILE_URL = (Taro as any).env?.VITE_FILE_BASE_URL || 'http://localhost:3000/uploads/'

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
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

const loadMore = () => { if (!hasMore.value || loading.value) return; fetchList() }
const statusText = (s: OrderStatus) => ({ pending: '待支付', confirmed: '已确认', shipped: '已发货', completed: '已完成', canceled: '已取消' }[s] || s)
const productNames = (o: Order): string => {
  const names = (o.items || [])
    .map(i => i.product?.name)
    .filter((n): n is string => !!n)
  return names.length > 0 ? names.join(', ') : '商品'
}
// 使用插槽，不再通过函数返回 VNode
// 价格由 slot #price 的 nut-price 渲染
const formatDate = (d?: string) => {
  if (!d) return ''
  try { return new Date(d).toLocaleString() } catch { return d }
}
const firstImageUrl = (o: Order): string => {
  try {
    for (const it of o.items || []) {
      const mats = it.product?.materials as any[] | undefined
      if (mats && mats.length > 0) {
        const img = mats.find(m => m?.type === 'image') || mats[0]
        const fp = img?.file_path as string | undefined
        if (fp) {
          const base = String(BASE_FILE_URL)
          const u = base.replace(/\/+$/, '/') + String(fp).replace(/^\/+/, '')
          return u
        }
      }
    }
  } catch {}
  return defaultThumb
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


