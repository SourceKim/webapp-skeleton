<template>
  <view class="detail-page">
    <nut-navbar title="商品详情" left-show @on-click-back="goBack" safe-area-inset-top>
      <template #right>
        <nut-icon name="cart" size="18" @click="showCart = true" />
      </template>
    </nut-navbar>

    <!-- 1. 头图占满，不留白 -->
    <swiper class="gallery" circular indicator-dots v-if="images.length">
      <swiper-item v-for="(img, idx) in images" :key="idx" class="gallery-item">
        <image :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 2. 商品信息 -->
    <view class="info-section">
      <text class="title">{{ spu?.name || 'Loading...' }}</text>
      <text class="desc">{{ spu?.sub_title || spu?.description || '暂无描述' }}</text>
    </view>

    <!-- 3. 数量选择 -->
    <view class="section">
      <view class="section-header">
        <text class="label">数量：</text>
      </view>
      <view class="section-body">
        <nut-input-number v-model="quantity" min="1" />
      </view>
    </view>

    <!-- 4. SKU 选择 -->
    <view class="section" v-if="attributeGroups.length > 0">
      <view class="attr-group" v-for="group in attributeGroups" :key="group.keyId">
        <text class="group-title">{{ group.keyName }}</text>
        <view class="group-values">
          <view 
            v-for="val in group.values" 
            :key="val.id"
            class="sku-tag"
            :class="{ active: selectedAttrs[group.keyId] === val.id }"
            @click="selectAttr(group.keyId, val.id)"
          >
            {{ val.name }}
          </view>
        </view>
      </view>
    </view>

    <!-- 详情内容 -->
    <view class="section detail-content">
      <text class="section-title">详情</text>
      <rich-text v-if="detailNodes" :nodes="detailNodes" />
      <text v-else class="desc">暂无详情</text>
    </view>

    <!-- 5. 底部操作栏 -->
    <view class="footer">
      <view class="total-price">
        <text class="label">总价:</text>
        <text class="symbol">¥</text>
        <text class="num">{{ totalPrice }}</text>
      </view>
      <view class="action-btns">
        <nut-button type="warning" @click="onAddCart">加入购物车</nut-button>
        <nut-button type="danger" @click="onBuyNow">立即购买</nut-button>
      </view>
    </view>
    
    <CartPopup v-model:modelValue="showCart" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CartPopup from '@/components/cart-popup.vue'
import api from '@/services/api'
import Taro, { useLoad } from '@tarojs/taro'
import mallService, { type Spu, getUploadUrl } from '@/services/mall'

// State
const spu = ref<Spu | null>(null)
const images = ref<string[]>([])
const detailNodes = ref<any>(null)
const showCart = ref(false)

// SKU Logic
const quantity = ref(1)
const allSkus = ref<any[]>([])
const attributeGroups = ref<any[]>([])
const selectedAttrs = ref<Record<string, string>>({})

// Computed
const currentSku = computed(() => {
  if (allSkus.value.length === 0) return null
  
  // Find SKU that matches all selected attributes
  return allSkus.value.find(sku => {
    const attrs = sku.sku_attributes || sku.attributes || []
    
    for (const keyId in selectedAttrs.value) {
      const valId = selectedAttrs.value[keyId]
      // Find attribute in sku
      const attr = attrs.find((a: any) => (a.key_id === keyId || a.attribute_key?.id === keyId))
      if (!attr) return false 
      const skuValId = attr.value_id || attr.attribute_value?.id || attr.attribute_value?.value_id
      if (String(skuValId) !== String(valId)) return false
    }
    return true
  }) || null 
})

const totalPrice = computed(() => {
  const price = Number(currentSku.value?.price || 0)
  return (price * quantity.value).toFixed(2)
})

// Lifecycle
useLoad((options) => {
  const id = String(options?.id || '')
  if (!id) {
    Taro.showToast({ title: '参数错误', icon: 'none' })
    Taro.navigateBack()
    return
  }
  loadDetail(id)
  loadSkus(id)
})

// Methods
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
  }
}

const loadSkus = async (spuId: string) => {
  const { code, data } = await mallService.getSkus({ 
    page: 1, 
    limit: 100, 
    filters: { spu_id: spuId, status: 'ON_SHELF' } 
  })
  
  if (code === 0 && data) {
    const items = (data as any).items || []
    allSkus.value = items
    processAttributes(items)
  }
}

const processAttributes = (skus: any[]) => {
  const groups: Map<string, { keyId: string, keyName: string, values: Map<string, string> }> = new Map()
  const keyOrder: string[] = []

  skus.forEach(sku => {
    const attrs = sku.sku_attributes || sku.attributes || []
    attrs.forEach((attr: any) => {
      const keyId = attr.key_id || attr.attribute_key?.id
      const keyName = attr.key_name || attr.attribute_key?.name || keyId
      const valId = attr.value_id || attr.attribute_value?.id || attr.attribute_value?.value_id
      const valName = attr.value || attr.attribute_value?.value || valId
      
      if (!keyId) return

      if (!groups.has(keyId)) {
        groups.set(keyId, { keyId, keyName, values: new Map() })
        keyOrder.push(keyId)
      }
      const group = groups.get(keyId)!
      if (!group.values.has(valId)) {
        group.values.set(valId, valName)
      }
    })
  })

  // Convert to array
  attributeGroups.value = keyOrder.map(keyId => {
    const g = groups.get(keyId)!
    return {
      keyId: g.keyId,
      keyName: g.keyName,
      values: Array.from(g.values.entries()).map(([id, name]) => ({ id, name }))
    }
  })

  // Default Select First Option
  attributeGroups.value.forEach(g => {
    if (g.values.length > 0) {
      selectedAttrs.value[g.keyId] = g.values[0].id
    }
  })
}

const selectAttr = (keyId: string, valId: string) => {
  selectedAttrs.value[keyId] = valId
}

const onAddCart = async () => {
  if (!currentSku.value) {
     Taro.showToast({ title: '请选择规格', icon: 'none' })
     return
  }
  const resp = await api.post('/cart', { sku_id: currentSku.value.id, quantity: quantity.value })
  if (resp.code === 0) {
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  } else {
    Taro.showToast({ title: resp.message || '加入失败', icon: 'none' })
  }
}

const onBuyNow = async () => {
  if (!currentSku.value) {
     Taro.showToast({ title: '请选择规格', icon: 'none' })
     return
  }
  const resp = await api.post('/cart', { sku_id: currentSku.value.id, quantity: quantity.value })
  if (resp.code === 0) {
    const itemId = (resp.data as any)?.id
    if (itemId) {
      Taro.navigateTo({ url: `/pages/mall/order-confirm/index?ids=${itemId}` })
    }
  }
}

const goBack = () => {
  const pages = Taro.getCurrentPages()
  if (pages.length > 1) {
    Taro.navigateBack()
  } else {
    Taro.switchTab({ url: '/pages/mall/index' })
  }
}
</script>

<style lang="scss">
.detail-page {
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
  background: $style-color-bg;
  min-height: 100vh;

  .gallery { width: 100vw; height: 100vw; background: $style-color-white; }
  .gallery-item image { width: 100%; height: 100%; display: block; }

  .info-section {
    background: $style-color-white;
    padding: $style-spacing-sm;
    margin-bottom: 12px;
    
    .title {
      display: block;
      font-size: $style-text-size-xl;
      font-weight: bold;
      color: $style-text-color-primary;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    
    .desc {
      display: block;
      font-size: $style-text-size-base;
      color: $style-text-color-secondary;
      line-height: 1.4;
    }
  }

  .section {
    background: $style-color-white;
    padding: $style-spacing-sm;
    margin-top: 12px;
    
    .section-header {
      margin-bottom: 12px;
      .label { font-size: $style-text-size-base; font-weight: bold; color: $style-text-color-primary; }
    }
    
    .section-title {
      display: block;
      font-weight: bold;
      margin-bottom: 12px;
      font-size: 15px;
      position: relative;
      padding-left: 10px;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 4px;
        bottom: 4px;
        width: 3px;
        background: $style-text-color-price;
        border-radius: 2px;
      }
    }
  }
  
  .attr-group {
    margin-bottom: 16px;
    &:last-child { margin-bottom: 0; }
    
    .group-title {
      display: block;
      font-size: $style-text-size-base;
      color: $style-text-color-primary;
      margin-bottom: 8px;
    }
    
    .group-values {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .sku-tag {
      padding: 6px $style-spacing-sm;
      background: #f2f2f2;
      border-radius: $style-border-radius-lg;
      font-size: $style-text-size-sm;
      color: $style-text-color-primary;
      border: 1px solid transparent;
      
      &.active {
        background: #fcedeb;
        color: $style-text-color-price;
        border-color: $style-text-color-price;
      }
    }
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: $style-color-white;
    display: flex;
    align-items: center;
    padding: 10px $style-spacing-sm;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    
    .total-price {
      flex: 1;
      display: flex;
      align-items: baseline;
      .label { font-size: $style-text-size-base; color: $style-text-color-primary; margin-right: 4px; }
      .symbol { font-size: $style-text-size-sm; color: $style-text-color-price; font-weight: bold;}
      .num { font-size: $style-text-size-sm; font-weight: bold; color: $style-text-color-price; }
    }
    
    .action-btns {
      display: flex;
      gap: 10px;
      
      .nut-button {
        min-width: 100px;
        margin: 0;
      }
    }
  }
}
</style>
