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
          <button
            size="mini"
            class="add-btn"
            :disabled="isAdded(item.id)"
            @tap.stop="addToCart(item)"
          >{{ isAdded(item.id) ? '已加入购物车' : '加入购物车' }}</button>
        </view>
      </view>

      <view class="loading" v-if="loading">加载中...</view>
      <view class="no-more" v-else-if="!hasMore">没有更多了</view>
    </scroll-view>

    <!-- 悬浮购物车按钮：可拖动，短按打开购物车 -->
     <!-- TODO: 在 H5 不可拖动，后续修复-->
    <view
      class="cart-fab"
      :style="fabStyle"
      @touchstart="onFabStart"
      @touchmove.stop="onFabMove"
      @touchend="onFabEnd"
      @tap.stop="onFabTap"
    >
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
import CartPanel from './components/cart-panel.vue'

const products = ref<Product[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)
const defaultImg = 'https://dummyimage.com/300x200/eaeaea/999.png&text=No+Image'
const showCart = ref(false)
const itemsCount = ref(0)
// 记录已加入购物车的商品
const addedMap = ref<Record<string, boolean>>({})
const isAdded = (id: string) => !!addedMap.value[id]
// 安全区底部间距（px）
const getSafeBottom = (): number => {
  try {
    const sys = Taro.getSystemInfoSync()
    const safeAreaBottom = (sys as any).safeArea?.bottom ?? sys.windowHeight
    const inset = Math.max(0, sys.windowHeight - Number(safeAreaBottom))
    return Number.isFinite(inset) ? inset : 0
  } catch {
    return 0
  }
}

// 悬浮按钮拖拽状态
const fabX = ref(0)
const fabY = ref(0)
const dragging = ref(false)
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0
// 记录触摸起点时间（如需区分点击/拖拽可再启用）
let dragged = false

const fabStyle = computed(() => `left:${fabX.value}px;top:${fabY.value}px;`)

const onFabStart = (e: any) => {
  dragging.value = true
  const t = e.touches?.[0]
  if (!t) return
  // Taro/H5/Weapp: 优先使用 pageX/pageY
  startX = (t.pageX ?? t.clientX) || 0
  startY = (t.pageY ?? t.clientY) || 0
  startLeft = fabX.value
  startTop = fabY.value
  dragged = false
}

const onFabMove = (e: any) => {
  if (!dragging.value) return
  const t = e.touches?.[0]
  if (!t) return
  const x = (t.pageX ?? t.clientX) || 0
  const y = (t.pageY ?? t.clientY) || 0
  const dx = x - startX
  const dy = y - startY
  let nx = startLeft + dx
  let ny = startTop + dy
  const sys = Taro.getSystemInfoSync()
  const maxX = sys.windowWidth - 80
  const maxY = sys.windowHeight - 140 - getSafeBottom()
  if (nx < 12) nx = 12
  if (ny < 80) ny = 80
  if (nx > maxX) nx = maxX
  if (ny > maxY) ny = maxY
  fabX.value = nx
  fabY.value = ny
  if (Math.abs(dx) + Math.abs(dy) > 4) dragged = true
}

const onFabEnd = () => {
  dragging.value = false
  // 点击通过 onFabTap 处理；此处仅重置拖拽标记
}

const onFabTap = () => {
  if (dragged) return
  openCart()
}

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
  if (isAdded(item.id)) return
  const resp = await cartService.addToCart({ product_id: item.id, quantity: 1 })
  if (resp.code === 0) {
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
    // 更新购物车徽标
    loadCount()
    // 标记为已加入
    addedMap.value[item.id] = true
  } else {
    Taro.showToast({ title: resp.message || '操作失败', icon: 'none' })
  }
}

const openCart = () => { showCart.value = true }
const onCountChange = (count: number) => { itemsCount.value = count }

const loadCount = async () => {
  const resp = await cartService.getCart()
  if (resp.code === 0 && resp.data) {
    const items = resp.data.items || []
    itemsCount.value = items.reduce((s, i) => s + (i.quantity || 0), 0)
    items.forEach((ci: any) => {
      const pid = ci?.product?.id
      if (pid) addedMap.value[pid] = true
    })
  }
}

onMounted(() => {
  fetchList(true)
  loadCount()
  // 初始化 FAB 位置（右下角，避开 tabbar 与安全区）
  const sys = Taro.getSystemInfoSync()
  fabX.value = Math.max(12, sys.windowWidth - 80)
  fabY.value = Math.max(80, sys.windowHeight - 180 - getSafeBottom())
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
    height: calc(100vh - 100px - env(safe-area-inset-bottom));
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
  z-index: 9999;
  background: #1677ff;
  color: #fff;
  border-radius: 18px;
  padding: 6px 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  user-select: none;
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


