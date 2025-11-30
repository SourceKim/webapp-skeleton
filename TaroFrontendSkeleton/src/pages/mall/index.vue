<template>
  <view class="brand-page">
    <nut-navbar title="选择品牌" safe-area-inset-top />
    <scroll-view class="grid" scroll-y>
      <view class="col">
        <view
          v-for="item in leftList"
          :key="`l-${item.id}`"
          class="card"
          @tap="goSub(item)"
        >
          <image v-if="getLogo(item)" class="logo" :src="getLogo(item)" mode="widthFix" />
          <view class="info">
            <view class="name">{{ item.name }}</view>
            <view class="desc" v-if="item.description">{{ item.description }}</view>
          </view>
        </view>
      </view>
      <view class="col">
        <view
          v-for="item in rightList"
          :key="`r-${item.id}`"
          class="card"
          @tap="goSub(item)"
        >
          <image v-if="getLogo(item)" class="logo" :src="getLogo(item)" mode="widthFix" />
          <view class="info">
            <view class="name">{{ item.name }}</view>
            <view class="desc" v-if="item.description">{{ item.description }}</view>
          </view>
        </view>
      </view>
      <nut-empty class="full-span" v-if="!loading && brands.length === 0" description="暂无品牌" />
      <view class="loading full-span" v-else-if="loading">加载中...</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted, computed } from 'vue'
import mallService, { type Brand, getUploadUrl } from '@/services/mall'

const brands = ref<Brand[]>([])
const loading = ref(false)
const leftList = computed(() => brands.value.filter((_, idx) => idx % 2 === 0))
const rightList = computed(() => brands.value.filter((_, idx) => idx % 2 === 1))

const fetchBrands = async () => {
  loading.value = true
  const { code, data } = await mallService.getBrands({ page: 1, limit: 50, status: 'ENABLED' })
  loading.value = false
  if (code === 0 && data) {
    brands.value = data.items
  }
}

const getLogo = (item: Brand) => getUploadUrl(item.material?.file_path)

const goSub = (item: Brand) => {
  Taro.navigateTo({ url: `/pages/mall/sub/index?brand_id=${item.id}` })
}

onMounted(fetchBrands)
</script>

<style lang="scss">
.brand-page {
  .grid {
    height: calc(100vh - 100px - env(safe-area-inset-bottom));
    padding: $style-spacing-sm;
    display: flex;
    align-items: flex-start;
    gap: $style-spacing-sm;
    flex-wrap: wrap;
  }
  .col { flex: 1; min-width: 0; }
  .card {
    background: $style-color-white;
    border-radius: $style-border-radius-base;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    margin-bottom: $style-spacing-sm;
    overflow: hidden;
  }
  .logo { width: 100%; height: auto; display: block; background: $style-color-bg; }
  .info { padding: 8px 10px 12px; }
  .name { font-weight: 600; font-size: $style-text-size-base; color: $style-text-color-primary; }
  .desc { margin-top: 4px; color: $style-text-color-secondary; font-size: $style-text-size-sm; line-height: 1.4; 
    overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .loading { text-align: center; color: $style-text-color-secondary; padding: 12px 0; }
  .full-span { flex-basis: 100%; width: 100%; }
}
</style>
