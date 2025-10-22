<template>
  <view class="mall-page">
    <view class="toolbar">
      <text class="title">商品列表</text>
    </view>

    <scroll-view class="list" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
      <view v-for="item in products" :key="item.id" class="card">
        <image
          class="cover"
          :src="firstImage(item) || defaultImg"
          mode="aspectFill"
        />
        <view class="info">
          <text class="name" @tap="goDetail(item.id)">{{ item.name }}</text>
          <text class="price">￥{{ formatPrice(item.price) }}</text>
          <text class="stock">库存 {{ item.stock }}</text>
          <button size="mini" class="add-btn" @tap.stop="addToCart(item)">加入购物车</button>
        </view>
      </view>

      <view class="loading" v-if="loading">加载中...</view>
      <view class="no-more" v-else-if="!hasMore">没有更多了</view>
    </scroll-view>

    <!-- 悬浮购物车按钮：打开子组件弹层 -->
    <view class="cart-fab" @tap="openCart">
      <text class="fab-text">购物车</text>
      <text v-if="itemsCount > 0" class="fab-badge">{{ itemsCount }}</text>
    </view>
    <cart-panel :visible="showCart" @close="showCart=false" @count-change="onCountChange" />
  </view>
  
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Taro from '@tarojs/taro'
import productService, { type Product, getMaterialUrl } from '../../services/product'
import { cartService } from '../../services'
import type { Cart } from '../../services/cart'
import CartPanel from './components/cart-panel.vue'

const products = ref<Product[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)
const defaultImg = 'https://dummyimage.com/300x200/eaeaea/999.png&text=No+Image'
const showCart = ref(false)
const cart = ref<Cart | null>(null)
const itemsCount = ref(0)

const fetchList = async (reset = false) => {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.value = 1
    products.value = []
    hasMore.value = true
  }
  const resp = await productService.getProducts({ page: page.value, limit: limit.value, sort_by: 'created_at', sort_order: 'DESC' })
  loading.value = false
  if (resp.code === 0 && resp.data) {
    const { items, meta } = resp.data
    total.value = meta.total
    products.value = products.value.concat(items)
    page.value += 1
    hasMore.value = products.value.length < total.value
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchList()
}

const formatPrice = (price: number) => {
  try {
    return Number(price).toFixed(2)
  } catch {
    return String(price)
  }
}

const firstImage = (item: Product) => {
  const fp = item.materials?.find(m => m.type === 'image')?.file_path || item.materials?.[0]?.file_path
  return getMaterialUrl(fp)
}

const goDetail = (id: string) => {
  Taro.navigateTo({ url: `/pages/mall/detail?id=${id}` })
}

const addToCart = async (item: Product) => {
  const resp = await cartService.addToCart({ product_id: item.id, quantity: 1 })
  if (resp.code === 0) {
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  } else {
    Taro.showToast({ title: resp.message || '操作失败', icon: 'none' })
  }
}

const openCart = () => { showCart.value = true }
const onCountChange = (count: number) => { itemsCount.value = count }

const loadCount = async () => {
  const resp = await cartService.getCart()
  if (resp.code === 0 && resp.data) itemsCount.value = (resp.data.items || []).reduce((s, i) => s + (i.quantity || 0), 0)
}

onMounted(() => {
  fetchList(true)
  loadCount()
})
</script>

<style lang="scss">
.mall-page {
  padding: 12px;
  .toolbar {
    margin-bottom: 12px;
    .title { font-size: 18px; font-weight: 600; }
  }
  .list {
    height: calc(100vh - 100px);
  }
  .card {
    display: flex;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .cover {
    width: 120px;
    height: 90px;
    background: #f2f2f2;
  }
  .info {
    flex: 1;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .name { font-size: 16px; color: #333; }
  .price { color: #e64a19; }
  .stock { color: #999; font-size: 12px; }
.add-btn { margin-top: 6px; background: #1677ff; color: #fff; font-size: 12px; padding: 4px 8px; border-radius: 4px; }
  .loading, .no-more { text-align: center; color: #999; padding: 12px 0; }
}

/* 悬浮购物车按钮 */
.cart-fab {
  position: fixed;
  right: 16px;
  bottom: 88px;
  z-index: 999;
  background: #1677ff;
  color: #fff;
  border-radius: 18px;
  padding: 6px 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
.fab-text { font-size: 12px; }
.fab-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0 6px;
}

/* 购物车弹层 */
.cart-modal {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 998;
  display: flex;
  align-items: flex-end;
}
.cart-panel {
  background: #fff;
  width: 100%;
  max-height: 70vh;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}
.cart-header { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f0f0f0; }
.close-btn { background: #f5f5f5; color: #333; padding: 4px 8px; border-radius: 4px; }
.cart-body { height: 48vh; }
.items { height: 100%; }
.cart-item { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #f5f5f5; }
.cart-item .name { flex: 1; color: #333; font-size: 14px; }
.cart-item .qty { width: 40px; text-align: right; color: #666; font-size: 12px; }
.cart-item .price { width: 80px; text-align: right; color: #e64a19; font-size: 12px; }
.rm-btn { padding: 2px 6px; font-size: 12px; }
.empty { padding: 24px; text-align: center; color: #999; }
.cart-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-top: 1px solid #f0f0f0; }
.total { color: #333; font-weight: 600; }
.clear-btn { background: #ff4d4f; color: #fff; padding: 4px 8px; border-radius: 4px; }
</style>


