<template>
  <view class="order-list">
    <scroll-view class="list" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
      <view class="card" v-for="o in orders" :key="o.id" @tap="goDetail(o.id)">
        <view class="row">
          <text class="status">{{ o.status }}</text>
          <text class="total">￥{{ formatPrice(o.total_price) }}</text>
        </view>
        <view class="sub">{{ o.created_at }}</view>
      </view>
      <view class="loading" v-if="loading">加载中...</view>
      <view class="no-more" v-else-if="!hasMore">没有更多了</view>
    </scroll-view>
  </view>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import orderService, { type Order } from '../../../services/order'

const orders = ref<Order[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)

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
const formatPrice = (price: number) => { try { return Number(price).toFixed(2) } catch { return String(price) } }
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
.order-list { padding: 12px; }
.list { height: calc(100vh - 100px); }
.card { background: #fff; border-radius: 8px; padding: 10px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 10px; }
.row { display: flex; justify-content: space-between; margin-bottom: 6px; .status { color: #1677ff; } .total { color: #333; font-weight: 600; } }
.sub { color: #999; font-size: 12px; }
.loading, .no-more { text-align: center; color: #999; padding: 12px 0; }
</style>


