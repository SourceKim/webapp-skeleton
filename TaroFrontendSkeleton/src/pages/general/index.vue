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
      <swiper-item v-for="(img, idx) in banners" :key="idx">
        <image :src="img" class="slide-image" mode="aspectFill" />
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

const auth = useAuthStore()
const navBarHeight = ref(44) // 默认安全距离

// 模拟全屏轮播图数据
const banners = ref([
  'https://images.unsplash.com/photo-1561758033-d8f53cb3209b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Burger
  'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Burger 2
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'  // Burger 3
])

onMounted(async () => {
  const sysInfo = Taro.getSystemInfoSync()
  navBarHeight.value = (sysInfo.statusBarHeight || 20) + 4
  
  const result = await auth.autoLoginByToken()
  if (!result.ok) {
    // Handle login failure if needed
  }
})

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
  background: #000;
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
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    
    .city {
      margin-left: 4px;
      margin-right: 10px;
      font-size: 14px;
    }
    .weather {
      font-size: 14px;
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
    border-radius: 8px; 
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
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 2px;
      }
      
      .sub-text {
        font-size: 10px;
        color: #999;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
  }
}
</style>
