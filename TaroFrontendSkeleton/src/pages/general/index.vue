<template>
  <view class="home-page">
    <!-- 1. 全屏轮播图 -->
    <swiper 
      class="full-screen-swiper" 
      :indicator-dots="true" 
      :autoplay="true" 
      :interval="5000" 
      :duration="500"
      circular
    >
      <swiper-item v-for="(item, idx) in banners" :key="item.id" @tap="handleBannerClick(item)">
        <image :src="getBannerUrl(item)" class="slide-image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 2. 左上角天气与定位 -->
    <view class="header-info" :style="{ paddingTop: navBarHeight + 'px' }">
      <view class="weather-location">
        <nut-icon name="location" size="14" color="#fff" />
        <text class="city">广州市</text>
        <text class="weather">16° 晴天</text>
      </view>
    </view>

    <!-- 3. 底部垂直入口按钮 -->
    <view class="bottom-actions">
      <!-- 按钮 1: 点单 -->
      <view class="action-btn order-btn" @tap="goMall">
        <view class="btn-content">
          <nut-icon name="shop" size="20" color="#333" class="btn-icon" />
          <view class="text-group">
            <text class="main-text">自助点单</text>
            <text class="sub-text">ORDER NOW</text>
          </view>
        </view>
        <nut-icon name="rect-right" size="16" color="#999" />
      </view>

      <!-- 按钮 2: 店铺介绍 -->
      <view class="action-btn intro-btn" @tap="goStoreIntro">
        <view class="btn-content">
          <nut-icon name="service" size="20" color="#333" class="btn-icon" />
          <view class="text-group">
            <text class="main-text">了解我们</text>
            <text class="sub-text">ABOUT US</text>
          </view>
        </view>
        <nut-icon name="rect-right" size="16" color="#999" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useAuthStore } from '../../stores/auth'
import homeService, { type Carousel, getUploadUrl } from '../../services/home'

const auth = useAuthStore()
const navBarHeight = ref(44) // 默认安全距离
const banners = ref<Carousel[]>([])

onMounted(async () => {
  const sysInfo = Taro.getSystemInfoSync()
  navBarHeight.value = (sysInfo.statusBarHeight || 20) + 4
  
  // 自动登录
  const result = await auth.autoLoginByToken()
  if (!result.ok) {
    // Handle login failure if needed
  }

  // 获取轮播图
  fetchBanners()
})

const fetchBanners = async () => {
  try {
    // 获取启用的轮播图
    const { code, data } = await homeService.getCarousels({ is_active: true, page: 1, limit: 10 })
    if (code === 0 && data && data.items) {
      // 按 sort_order 排序（虽然后端可能已排好，但前端保底）
      banners.value = data.items.sort((a, b) => a.sort_order - b.sort_order)
    }
  } catch (error) {
    console.error('Fetch banners failed:', error)
  }
}

const getBannerUrl = (item: Carousel) => {
  return getUploadUrl(item.material?.file_path)
}

const handleBannerClick = (item: Carousel) => {
  if (item.spu_id) {
    Taro.navigateTo({ url: `/pages/mall/detail/index?id=${item.spu_id}` })
  }
}

const goMall = () => {
  Taro.switchTab({ url: '/pages/mall/index' })
}

const goStoreIntro = () => {
  Taro.navigateTo({ url: '/pages/store-intro/index' })
}
</script>

<style lang="scss">
.home-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: $style-color-black;
}

.full-screen-swiper {
  width: 100%;
  height: 100%;
  
  .slide-image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.header-info {
  position: absolute;
  left: 20px;
  top: 0;
  z-index: 10;
  
  .weather-location {
    display: flex;
    align-items: center;
    color: $style-color-white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    
    .city {
      margin-left: 4px;
      margin-right: 10px;
      font-size: $style-text-size-base;
    }
    .weather {
      font-size: $style-text-size-base;
    }
  }
}

.bottom-actions {
  position: absolute;
  bottom: 20px; 
  left: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .action-btn {
    background: rgba(255, 255, 255, 0.95);
    border-radius: $style-border-radius-base; 
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    
    &:active {
      background: rgba(255, 255, 255, 0.85);
    }
    
    .btn-content {
      display: flex;
      align-items: center;
    }
    
    .btn-icon {
      margin-right: 12px;
    }
    
    .text-group {
      display: flex;
      flex-direction: column;
      
      .main-text {
        font-size: $style-text-size-xl;
        font-weight: bold;
        color: $style-text-color-primary;
        margin-bottom: 2px;
      }
      
      .sub-text {
        font-size: $style-text-size-xs;
        color: $style-text-color-secondary;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
  }
}
</style>
