<template>
  <view class="sub-page">
    <nut-navbar title="商城" left-show @on-click-back="goBack" safe-area-inset-top>
      <template #right>
        <nut-icon name="cart" size="18" @click="showCart = true" />
      </template>
    </nut-navbar>
    <scroll-view class="main" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
      <view v-if="brand" class="brand-intro">
        <image v-if="getBrandLogo(brand)" class="brand-logo" :src="getBrandLogo(brand)" mode="aspectFill" />
        <view class="brand-text">
          <view class="brand-name">{{ brand.name }}</view>
          <view v-if="brand.description" class="brand-desc">{{ brand.description }}</view>
        </view>
      </view>

      <view class="content">
        <view class="left">
          <view
            v-for="c in categories"
            :key="c.id"
            class="cat-item"
            :class="{ active: c.id === activeCatId }"
            @tap="selectCat(c.id)"
          >
            {{ c.name }}
          </view>
        </view>

        <view class="right">
          <nut-card
            v-for="s in spus"
            :key="s.id"
            :title="s.name"
            :desc="s.sub_title || s.description"
            @click="goDetail(s.id)"
          >
            <template #prolist>
              <image class="cover" :src="getCover(s) || defaultImg" mode="aspectFill" />
            </template>
            <template #footer>
              <view class="card-actions">
                <nut-button type="default" size="small" @tap.stop @click.stop="openSku(s, 'cart')">加入购物车</nut-button>
                <nut-button type="primary" size="small" @tap.stop @click.stop="openSku(s, 'buy')">立即购买</nut-button>
              </view>
            </template>
          </nut-card>
          <nut-empty v-if="!loading && spus.length === 0" description="暂无商品" />
          <view class="loading" v-else-if="loading">加载中...</view>
          <view class="no-more" v-else-if="!hasMore">没有更多了</view>
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
  const { code, data } = await mallService.getCategories({ page: 1, limit: 50, parent_id: null, status: 'ENABLED' })
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
  const resp = await api.post('/cart', { sku_id: skuId, quantity })
  if (resp.code === 0) {
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  } else {
    Taro.showToast({ title: resp.message || '加入失败', icon: 'none' })
  }
  skuVisible.value = false
}

function onBuyNow() {
  // 仅关闭弹窗，后续可跳转下单页
  skuVisible.value = false
}

const selectCat = (id: string) => {
  activeCatId.value = id
  fetchSpus(true)
}

const goDetail = (id: string) => {
  Taro.navigateTo({ url: `/pages/mall/detail?id=${id}` })
}

onMounted(async () => {
  brandId.value = (router?.params?.brand_id as string) || ''
  await fetchBrand()
  await fetchCategories()
  await fetchSpus(true)
})
</script>

<style lang="scss">
.sub-page {
  .main { height: calc(100vh - 100px - env(safe-area-inset-bottom)); padding: 12px; box-sizing: border-box; }
  .content { display: flex; }
  .left {
    width: 100px;
    background: #fafafa;
  }
  .cat-item {
    padding: 12px;
    border-left: 3px solid transparent;
  }
  .cat-item.active {
    background: #fff;
    border-left-color: #fa2c19;
    font-weight: 600;
  }
  .right { flex: 1; padding-left: 12px; }
  .card-actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
  .brand-intro { display: flex; align-items: center; padding: 12px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 12px; }
  .brand-logo { width: 56px; height: 56px; border-radius: 8px; background: #f5f5f5; }
  .brand-text { margin-left: 12px; }
  .brand-name { font-weight: 600; }
  .brand-desc { margin-top: 4px; color: #666; font-size: 12px; line-height: 1.5; }
  .cover { width: 100%; height: 120px; border-radius: 8px; background: #f5f5f5; }
  .loading, .no-more { text-align: center; color: #999; padding: 12px 0; }
}
</style>


