<template>
  <view class="detail-page">
    <nut-navbar title="商品详情" left-show @on-click-back="goBack" safe-area-inset-top >
      <template #right>
        <nut-icon name="cart" size="18" @click="showCart = true" />
      </template>
    </nut-navbar>

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
      <view class="action-btns">
        <nut-button type="primary" plain size="large" @click="openSku('cart')">加入购物车</nut-button>
        <nut-button type="primary" size="large" @click="openSku('buy')">立即购买</nut-button>
      </view>
    </view>
    <SkuPanel
      v-model:modelValue="skuVisible"
      :sku="skuTree"
      :sku-list="skuList"
      :goods="goodsData"
      :loading="skuLoading"
      :btn-options="['buy','cart']"
      @close="skuVisible = false"
      @add-cart="onAddCart"
      @buy-click="onBuyNow"
    />
    <CartPopup v-model:modelValue="showCart" />
  </view>
  
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import SkuPanel from '@/components/sku-panel.vue'
import CartPopup from '@/components/cart-popup.vue'
import api from '@/services/api'
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
// 购物车弹层
const showCart = ref(false)

const loadDetail = async (id: string) => {
  const resp = await mallService.getSpuDetail(id)
  if (resp.code === 0 && resp.data) {
    spu.value = resp.data
    const list: string[] = []
    const main = getUploadUrl(resp.data.main_material?.file_path)
    if (main) list.push(main)
    const subs = (resp.data.sub_materials || [])
      .map(m => getUploadUrl(m.file_path))
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
      price: Number(price) || 0,
      stockNum
    }
  } finally {
    skuLoading.value = false
  }
}

async function onAddCart(payload?: any) {
  console.log("onaddcart", payload)
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

function buildNutSkuData(skus: any[]) {
  if (!skus || skus.length === 0) {
    return { tree: [], list: [], price: '0', stockNum: 0 }
  }
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
  // 转为 NutUI sku 组结构
  const tree = keyOrder.map((keyId) => {
    const entry = keyMap.get(keyId)!
    return { id: entry.k_id, name: entry.k, list: Array.from(entry.vMap.entries()).map(([id, name]) => ({ id, name, active: false, disable: false })) }
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
</script>

<style lang="scss">
.detail-page {
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
  background: #f7f7f7;
  min-height: 100vh;
  .gallery { height: 100vw; background: #fff; }
  .gallery-item { display: flex; align-items: center; justify-content: center; }
  .gallery image, .gallery .placeholder-img { width: 100%; height: 100%; object-fit: contain; }
  .section { background: #fff; padding: 12px; margin-top: 12px; }
  .section-title { display: block; font-weight: 600; margin-bottom: 12px; font-size: 16px; color: #333; }
  .desc { color: #666; line-height: 1.6; font-size: 14px; }
  
  .footer { 
    position: fixed; 
    left: 0; 
    right: 0; 
    bottom: 0;
    z-index: 10; 
    background: #fff; 
    display: flex; 
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    
    .action-btns {
      flex: 1;
      display: flex;
      gap: 10px;
      max-width: 600px;
      width: 100%;
      
      .nut-button {
        flex: 1;
        margin: 0;
      }
    }
  }
}
</style>


