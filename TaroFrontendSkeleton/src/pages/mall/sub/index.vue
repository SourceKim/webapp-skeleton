<template>
  <view class="sub-page">
    <nut-navbar title="商城" left-show @on-click-back="goBack" safe-area-inset-top>
      <template #right>
        <nut-icon name="cart" size="18" @click="showCart = true" />
      </template>
    </nut-navbar>
    <scroll-view class="main" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
      <!-- 品牌介绍卡片 -->
      <view v-if="brand" class="brand-card">
        <view class="brand-header">
          <image v-if="getBrandLogo(brand)" class="brand-logo" :src="getBrandLogo(brand)" mode="aspectFill" />
          <view class="brand-info">
            <view class="brand-name">{{ brand.name }}</view>
            <view v-if="brand.description" class="brand-desc">{{ brand.description }}</view>
          </view>
        </view>
      </view>

      <view class="content-wrapper">
        <!-- 左侧分类 -->
        <scroll-view class="category-side" scroll-y>
          <view
            v-for="c in categories"
            :key="c.id"
            class="cat-item"
            :class="{ active: c.id === activeCatId }"
            @tap="selectCat(c.id)"
          >
            <text class="cat-name">{{ c.name }}</text>
          </view>
        </scroll-view>

        <!-- 右侧商品 -->
        <view class="goods-side">
          <view class="goods-list">
            <view 
              class="goods-card"
              v-for="s in spus"
              :key="s.id"
              @tap="goDetail(s.id)"
            >
              <image class="goods-img" :src="getCover(s) || defaultImg" mode="aspectFill" />
              <view class="goods-info">
                <view class="goods-name">{{ s.name }}</view>
                <view class="goods-sub" v-if="s.sub_title">{{ s.sub_title }}</view>
                <view class="goods-actions">
                  <view v-if="cartStore.getSpuQty(s.id) > 0" class="action-stepper">
                    <view class="btn minus" @tap.stop="handleMinus(s)">-</view>
                    <text class="num">{{ cartStore.getSpuQty(s.id) }}</text>
                    <view class="btn plus" @tap.stop="handlePlus(s)">+</view>
                  </view>
                  <view v-else class="action-add" @tap.stop="handlePlus(s)">
                    <nut-icon name="plus" size="14" color="#fff" />
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <view class="state-tip" v-if="!loading && spus.length === 0">
            <nut-empty description="暂无商品" />
          </view>
          <view class="state-tip" v-else-if="loading">
            <text>加载中...</text>
          </view>
          <view class="state-tip" v-else-if="!hasMore">
            <text>没有更多了</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <SkuPanel
      v-model:modelValue="skuVisible"
      :sku="skuTree"
      :sku-list="skuList"
      :goods="goodsData"
      :loading="skuLoading"
      :btn-options="['buy', 'cart']"
      @close="skuVisible = false"
      @add-cart="onAddCart"
      @buy-click="onBuyNow"
    />
    <CartPopup v-model:modelValue="showCart" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import SkuPanel from '@/components/sku-panel.vue'
import CartPopup from '@/components/cart-popup.vue'
import api from '@/services/api'
import Taro, { useRouter } from '@tarojs/taro'
import mallService, { type Category, type Spu, type Brand, getUploadUrl } from '@/services/mall'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const router = useRouter()
const brandId = ref<string>('')
const brand = ref<Brand | null>(null)
const categories = ref<Category[]>([])
const activeCatId = ref<string | null>(null)
const spus = ref<Spu[]>([])
const defaultImg = 'https://dummyimage.com/300x200/eaeaea/999.png&text=No+Image'
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)

// SKU 弹窗相关
const skuVisible = ref(false)
const skuLoading = ref(false)
const skuAction = ref<'cart' | 'buy'>('cart')
const currentSpu = ref<Spu | null>(null)
const goodsData = shallowRef<any>({ price: '0', imagePath: '', stockNum: 0 })
const skuTree = shallowRef<any[]>([])
const skuList = shallowRef<any[]>([])
// 购物车弹层
const showCart = ref(false)

const goBack = () => Taro.navigateBack()

const getCover = (s: Spu) => getUploadUrl(s.main_material?.file_path)
const getBrandLogo = (b: Brand | null) => b ? getUploadUrl(b.material?.file_path) : ''

const fetchCategories = async () => {
  const params: any = { page: 1, limit: 100, status: 'ENABLED' }
  if (brandId.value) {
    // 如果有品牌，获取该品牌下的所有分类（扁平）
    params.filters = { brand_id: brandId.value }
  } else {
    // 否则获取顶级分类
    params.parent_id = null
  }
  const { code, data } = await mallService.getCategories(params)
  if (code === 0 && data) {
    categories.value = data.items
    activeCatId.value = data.items[0]?.id || null
  }
}

const fetchBrand = async () => {
  if (!brandId.value) return
  const { code, data } = await mallService.getBrand(brandId.value)
  if (code === 0 && data) {
    brand.value = data as any
  }
}

const fetchSpus = async (reset = false) => {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.value = 1
    spus.value = []
    hasMore.value = true
  }
  const filters: any = { status: 'ON_SHELF' }
  if (brandId.value) filters.brand_id = brandId.value
  if (activeCatId.value) filters.category_id = activeCatId.value
  const params: any = { page: page.value, limit: limit.value, filters }
  const { code, data } = await mallService.getSpus(params)
  loading.value = false
  if (code === 0 && data) {
    total.value = data.meta.total
    spus.value = spus.value.concat(data.items)
    page.value += 1
    hasMore.value = spus.value.length < total.value
  }
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  fetchSpus()
}

const openSku = async (spu: Spu, action: 'cart' | 'buy') => {
  skuAction.value = action
  currentSpu.value = spu
  skuVisible.value = true
  skuLoading.value = true
  try {
    const { code, data } = await mallService.getSkus({ page: 1, limit: 100, filters: { spu_id: spu.id, status: 'ON_SHELF' } })
    const items = code === 0 && data ? data.items as any[] : []
    const { tree, list, price, stockNum } = buildNutSkuData(items)
    skuTree.value = tree
    skuList.value = list
    goodsData.value = {
      imagePath: getCover(spu) || defaultImg,
      spuId: spu.id,
      price: Number(price) || 0,
      stockNum
    }
  } finally {
    skuLoading.value = false
  }
}

function buildNutSkuData(skus: any[]) {
  if (!skus || skus.length === 0) {
    return { tree: [], list: [], price: '0', stockNum: 0 }
  }
  // 组装规格树，优先使用 sku_attributes 的中文名，回退 attributes
  const keyMap = new Map<string, { k: string; k_id: string; vMap: Map<string, string> }>()
  const keyOrder: string[] = []
  for (const sku of skus) {
    const attrsVerbose: Array<any> = sku.sku_attributes || []
    if (attrsVerbose.length > 0) {
      for (const it of attrsVerbose) {
        const keyId = it?.attribute_key?.id
        if (!keyId) continue
        const keyName = it?.attribute_key?.name || keyId
        const valId = it?.attribute_value?.value_id || it?.attribute_value?.id
        const valName = it?.attribute_value?.value || valId
        if (!keyMap.has(keyId)) {
          keyOrder.push(keyId)
          keyMap.set(keyId, { k: keyName, k_id: keyId, vMap: new Map() })
        }
        const entry = keyMap.get(keyId)!
        if (valId && !entry.vMap.has(valId)) entry.vMap.set(valId, valName)
      }
    } else {
      const attrs: Array<any> = sku.attributes || []
      for (const a of attrs) {
        if (!keyMap.has(a.key_id)) {
          keyOrder.push(a.key_id)
          keyMap.set(a.key_id, { k: a.key_name || a.key_id, k_id: a.key_id, vMap: new Map() })
        }
        const entry = keyMap.get(a.key_id)!
        if (a.value_id && !entry.vMap.has(a.value_id)) entry.vMap.set(a.value_id, a.value || a.value_id)
      }
    }
  }

  // 转为 NutUI 需要的 sku 组结构：[{ id, name, list: [{ id, name, active, disable }] }]
  const tree = keyOrder.map((keyId) => {
    const entry = keyMap.get(keyId)!
    return {
      id: entry.k_id,
      name: entry.k,
      list: Array.from(entry.vMap.entries()).map(([id, name]) => ({ id, name, active: false, disable: false }))
    }
  })

  const list = skus.map((sku) => {
    const row: any = { id: sku.id, price: Number(sku.price || 0), stock: Number(sku.stock || 0) }
    const pairs: string[] = []
    const attrsVerbose: Array<any> = sku.sku_attributes || []
    if (attrsVerbose.length > 0) {
      for (const it of attrsVerbose) {
        const keyId = it?.attribute_key?.id
        const valId = it?.attribute_value?.value_id || it?.attribute_value?.id
        if (keyId && valId) pairs.push(`${keyId}:${valId}`)
      }
    } else {
      const attrs: Array<any> = sku.attributes || []
      for (const a of attrs) {
        if (a?.key_id && a?.value_id) pairs.push(`${a.key_id}:${a.value_id}`)
      }
    }
    row.skuId = pairs.join(';')
    return row
  })

  const price = String(list[0]?.price ?? '0')
  const stockNum = list.reduce((sum: number, it: any) => sum + (Number(it.stock) || 0), 0)
  return { tree, list, price, stockNum }
}

async function onAddCart(payload?: any) {
  const skuId = payload?.sku?.id || payload?.id || payload?.skuId
  const quantity = Number(payload?.buyNum || payload?.num || 1)
  if (!skuId) { Taro.showToast({ title: '请选择规格', icon: 'none' }); return }
  await cartStore.addToCart(skuId, quantity)
  skuVisible.value = false
}

async function onBuyNow(payload?: any) {
  const skuId = payload?.sku?.id || payload?.id || payload?.skuId
  const quantity = Number(payload?.buyNum || payload?.num || 1)
  
  if (!skuId) { 
    Taro.showToast({ title: '请选择规格', icon: 'none' })
    return 
  }

  const resp = await api.post('/cart', { sku_id: skuId, quantity })
  if (resp.code === 0) {
    skuVisible.value = false
    const itemId = (resp.data as any)?.id
    if (itemId) {
      Taro.navigateTo({ url: `/pages/mall/order-confirm/index?ids=${itemId}` })
    } else {
      Taro.showToast({ title: '已加入购物车', icon: 'success' })
    }
  } else {
    Taro.showToast({ title: resp.message || '操作失败', icon: 'none' })
  }
}

const selectCat = (id: string) => {
  activeCatId.value = id
  fetchSpus(true)
}

const goDetail = (id: string) => {
  Taro.navigateTo({ url: `/pages/mall/detail?id=${id}` })
}

const handlePlus = (spu: Spu) => {
  const item = cartStore.getCartItemBySpu(spu.id)
  if (item) {
    // 购物车中已有该 SPU 且为单规格项（或只添加了一种规格），则直接 +1
    cartStore.updateQty(item.id, Number(item.quantity) + 1)
  } else {
    // 购物车没有，或有多种规格，打开 SKU 面板
    openSku(spu, 'cart')
  }
}

const handleMinus = (spu: Spu) => {
  const item = cartStore.getCartItemBySpu(spu.id)
  if (item) {
    cartStore.updateQty(item.id, Number(item.quantity) - 1)
  } else {
    Taro.showToast({ title: '多规格商品请在购物车调整', icon: 'none' })
  }
}

onMounted(async () => {
  brandId.value = (router?.params?.brand_id as string) || ''
  await fetchBrand()
  await fetchCategories()
  await fetchSpus(true)
  await cartStore.fetchCart()
})
</script>

<style lang="scss">
.sub-page {
  min-height: 100vh;
  background: $style-color-bg;

  .main {
    height: calc(100vh - env(safe-area-inset-bottom));
  }

  .brand-card {
    background: $style-color-white;
    margin: 12px 12px 0;
    padding: $style-spacing-sm;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    
    .brand-header {
      display: flex;
      align-items: center;
      
      .brand-logo {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        background: $style-color-bg;
        flex-shrink: 0;
        border: 1px solid rgba(0,0,0,0.05);
      }
      
      .brand-info {
        margin-left: 12px;
        flex: 1;
        
        .brand-name {
          font-size: $style-text-size-lg;
          font-weight: 600;
          color: $style-text-color-primary;
          margin-bottom: 4px;
        }
        
        .brand-desc {
          font-size: $style-text-size-sm;
          color: $style-text-color-regular;
          line-height: 1.4;
        }
      }
    }
  }

  .content-wrapper {
    display: flex;
    margin-top: 12px;
    height: calc(100vh - 180px); // 减去顶部导航和品牌卡片的大致高度
    
    .category-side {
      width: 90px;
      background: $style-color-bg;
      
      .cat-item {
        padding: 14px 10px;
        text-align: center;
        position: relative;
        
        .cat-name {
          font-size: 13px;
          color: $style-text-color-regular;
        }
        
        &.active {
          background: $style-color-white;
          border-radius: 8px 0 0 8px;
          
          .cat-name {
            color: $style-text-color-price;
            font-weight: 600;
          }
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 16px;
            background: $style-text-color-price;
            border-radius: 0 2px 2px 0;
          }
        }
      }
    }

    .goods-side {
      flex: 1;
      background: $style-color-white;
      padding: 12px;
      border-radius: 8px 0 0 0;
      
      .goods-list {
        .goods-card {
          display: flex;
          margin-bottom: 16px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .goods-img {
            width: 88px;
            height: 88px;
            border-radius: 6px;
            background: #f9f9f9;
            flex-shrink: 0;
          }
          
          .goods-info {
            flex: 1;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2px 0;
            
            .goods-name {
              font-size: $style-text-size-base;
              font-weight: 600;
              color: $style-text-color-primary;
              line-height: 1.4;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            
            .goods-sub {
              font-size: 11px;
              color: $style-text-color-secondary;
              margin-top: 4px;
            }
            
            .goods-actions {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              gap: 8px;
              margin-top: 8px;
              
              .action-add {
                width: 24px;
                height: 24px;
                background: $style-color-primary;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                
                &:active {
                  opacity: 0.8;
                }
              }
              
              .action-stepper {
                display: flex;
                align-items: center;
                gap: 8px;
                
                .btn {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: $style-text-size-lg;
                  font-weight: bold;
                  
                  &.minus {
                    border: 1px solid $style-border-color;
                    color: $style-text-color-regular;
                    background: $style-color-white;
                  }
                  
                  &.plus {
                    background: $style-color-primary;
                    color: $style-color-white;
                  }
                }
                
                .num {
                  font-size: $style-text-size-base;
                  color: $style-text-color-primary;
                  min-width: 16px;
                  text-align: center;
                }
              }
            }
          }
        }
      }
      
      .state-tip {
        padding: 20px 0;
        text-align: center;
        color: $style-text-color-secondary;
        font-size: $style-text-size-sm;
      }
    }
  }
}
</style>
