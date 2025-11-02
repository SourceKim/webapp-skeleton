<template>
  <view class="detail-page">
    <nut-navbar title="商品详情" left-show @on-click-back="goBack" safe-area-inset-top />

    <swiper class="gallery" circular indicator-dots v-if="images.length">
      <swiper-item v-for="(img, idx) in images" :key="idx" class="gallery-item">
        <image :src="img" mode="aspectFit" />
      </swiper-item>
    </swiper>
    <view v-else class="gallery placeholder">
      <image class="placeholder-img" :src="defaultImg" mode="aspectFit" />
    </view>

    <view class="section">
      <text class="section-title">商品描述</text>
      <text class="desc">{{ spu?.sub_title || spu?.description || '暂无描述' }}</text>
    </view>

    <view class="section">
      <text class="section-title">详情</text>
      <rich-text v-if="detailNodes" :nodes="detailNodes" />
      <text v-else class="desc">暂无详情</text>
    </view>

    <view class="footer">
      <nut-button type="default" @tap.stop @click.stop="openSku('cart')">加入购物车</nut-button>
      <nut-button type="primary" @tap.stop @click.stop="openSku('buy')">立即购买</nut-button>
    </view>
    <nut-sku
      v-model:visible="skuVisible"
      :sku="skuTree"
      :sku-list="skuList"
      :goods="goodsData"
      :loading="skuLoading"
      @close="skuVisible = false"
      @add-cart="onAddCart"
      @buy-click="onBuyNow"
    />
  </view>
  
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import mallService, { type Spu, getUploadUrl } from '@/services/mall'

const spu = ref<Spu | null>(null)
const images = ref<string[]>([])
const defaultImg = 'https://dummyimage.com/600x400/eaeaea/999.png&text=No+Image'
const detailNodes = ref<any>(null)
// SKU 弹窗相关
const skuVisible = ref(false)
const skuLoading = ref(false)
const skuAction = ref<'cart' | 'buy'>('cart')
const skuTree = shallowRef<any[]>([])
const skuList = shallowRef<any[]>([])
const goodsData = shallowRef<any>({ price: '0', imagePath: '', stockNum: 0 })

const loadDetail = async (id: string) => {
  const resp = await mallService.getSpuDetail(id)
  if (resp.code === 0 && resp.data) {
    spu.value = resp.data
    const list: string[] = []
    const main = getUploadUrl(resp.data.main_material || undefined)
    if (main) list.push(main)
    const subs = (resp.data.sub_materials || [])
      .map(m => getUploadUrl(m))
      .filter((u): u is string => !!u)
    images.value = list.concat(subs)
    if (resp.data.detail_content) {
      detailNodes.value = resp.data.detail_content
    }
  } else {
    Taro.showToast({ title: resp.message || '加载失败', icon: 'none' })
  }
}

useLoad((options) => {
  const id = String(options?.id || '')
  if (!id) {
    Taro.showToast({ title: '参数错误', icon: 'none' })
    Taro.navigateBack()
    return
  }
  loadDetail(id)
})

const goBack = () => {
  // 优先返回上一页，否则回到商城列表
  if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
    Taro.navigateBack()
  } else {
    Taro.switchTab({ url: '/pages/mall/index' })
  }
}

const openSku = async (action: 'cart' | 'buy') => {
  if (!spu.value) return
  skuAction.value = action
  skuVisible.value = true
  skuLoading.value = true
  try {
    const { code, data } = await mallService.getSkus({ page: 1, limit: 100, filters: { spu_id: spu.value.id, status: 'ON_SHELF' } })
    const items = code === 0 && data ? (data as any).items : []
    const { tree, list, price, stockNum } = buildNutSkuData(items)
    skuTree.value = tree
    skuList.value = list
    goodsData.value = {
      imagePath: images.value[0] || defaultImg,
      spuId: spu.value.id,
      price,
      stockNum
    }
  } finally {
    skuLoading.value = false
  }
}

function onAddCart() {
  skuVisible.value = false
}

function onBuyNow() {
  skuVisible.value = false
}

function buildNutSkuData(skus: any[]) {
  if (!skus || skus.length === 0) {
    return { tree: [], list: [], price: '0', stockNum: 0 }
  }
  const keyMap = new Map<string, { k: string; k_id: string; k_s: string; v: Array<{ id: string; name: string }> }>()
  const keyOrder: string[] = []
  skus.forEach((sku) => {
    const attrs: Array<any> = sku.attributes || []
    attrs.forEach((a: any) => {
      if (!keyMap.has(a.key_id)) {
        keyOrder.push(a.key_id)
        keyMap.set(a.key_id, { k: a.key_name || a.key_id, k_id: a.key_id, k_s: `s${keyOrder.length}`, v: [] })
      }
      const entry = keyMap.get(a.key_id)!
      if (!entry.v.find((x) => x.id === a.value_id)) {
        entry.v.push({ id: a.value_id, name: a.value || a.value_id })
      }
    })
  })
  const tree = Array.from(keyMap.values())
  const list = skus.map((sku) => {
    const row: any = { id: sku.id, skuId: sku.id, price: Number(sku.price || '0'), stockNum: Number(sku.stock || 0) }
    const attrs: Array<any> = sku.attributes || []
    attrs.forEach((a: any) => {
      const idx = keyOrder.indexOf(a.key_id)
      if (idx >= 0) row[`s${idx + 1}`] = a.value_id
    })
    return row
  })
  const price = String(list[0]?.price ?? '0')
  const stockNum = list.reduce((sum: number, it: any) => sum + (Number(it.stockNum) || 0), 0)
  return { tree, list, price, stockNum }
}
</script>

<style lang="scss">
.detail-page {
  padding-bottom: 24px;
  .gallery { height: 300px; background: #000; }
  .gallery-item { display: flex; align-items: center; justify-content: center; }
  .gallery image, .gallery .placeholder-img { width: 100%; height: 100%; object-fit: contain; }
  .section { background: #fff; padding: 12px; margin-top: 8px; }
  .section-title { display: block; font-weight: 600; margin-bottom: 8px; }
  .desc { color: #444; line-height: 1.6; }
  .footer { position: fixed; left: 0; right: 0; bottom: env(safe-area-inset-bottom); z-index: 10; background: #fff; display: flex; gap: 12px; padding: 10px 12px env(safe-area-inset-bottom); box-shadow: 0 -2px 8px rgba(0,0,0,0.06); }
}
</style>


