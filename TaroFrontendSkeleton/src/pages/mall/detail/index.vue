<template>
  <view class="detail-page">
    <view class="header">
      <button class="back-btn" @tap="goBack">返回</button>
      <text class="title">{{ product?.name || '商品详情' }}</text>
    </view>

    <swiper class="gallery" circular indicator-dots v-if="images.length">
      <swiper-item v-for="(img, idx) in images" :key="idx" class="gallery-item">
        <image :src="img" mode="aspectFit" />
      </swiper-item>
    </swiper>
    <view v-else class="gallery placeholder">
      <image class="placeholder-img" :src="defaultImg" mode="aspectFit" />
    </view>

    <view class="section">
      <text class="price">￥{{ formatPrice(product?.price || 0) }}</text>
      <text class="stock">库存 {{ product?.stock || 0 }}</text>
    </view>

    <view class="section">
      <text class="section-title">商品描述</text>
      <text class="desc">{{ product?.description || '暂无描述' }}</text>
    </view>
  </view>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import productService, { type Product, getMaterialUrl } from '../../../services/product'

const product = ref<Product | null>(null)
const images = ref<string[]>([])
const defaultImg = 'https://dummyimage.com/600x400/eaeaea/999.png&text=No+Image'

const loadDetail = async (id: string) => {
  const resp = await productService.getProduct(id)
  if (resp.code === 0 && resp.data) {
    product.value = resp.data
    const list = (resp.data.materials || [])
      .filter(m => m.type === 'image' || !!m.file_path)
      .map(m => getMaterialUrl(m.file_path))
      .filter((u): u is string => !!u)
    images.value = list.length ? list : []
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

const formatPrice = (price: number) => {
  try { return Number(price).toFixed(2) } catch { return String(price) }
}

const goBack = () => {
  // 优先返回上一页，否则回到商城列表
  if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
    Taro.navigateBack()
  } else {
    Taro.switchTab({ url: '/pages/mall/index' })
  }
}

onMounted(() => {})
</script>

<style lang="scss">
.detail-page {
  padding-bottom: 24px;
  .header { padding: 12px; background: #fff; margin-bottom: 8px; display: flex; align-items: center; }
  .back-btn { margin-right: 12px; padding: 6px 10px; border-radius: 4px; background: #f5f5f5; border: 1px solid #e8e8e8; }
  .title { font-size: 18px; font-weight: 600; }
  .gallery { height: 300px; background: #000; }
  .gallery-item { display: flex; align-items: center; justify-content: center; }
  .gallery image, .gallery .placeholder-img { width: 100%; height: 100%; object-fit: contain; }
  .section { background: #fff; padding: 12px; margin-top: 8px; }
  .section-title { display: block; font-weight: 600; margin-bottom: 8px; }
  .price { color: #e64a19; font-size: 20px; margin-right: 12px; }
  .stock { color: #999; }
  .desc { color: #444; line-height: 1.6; }
}
</style>


