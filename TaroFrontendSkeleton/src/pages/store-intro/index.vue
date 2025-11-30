<template>
  <view class="store-intro">
    <nut-navbar title="店铺介绍" />
    
    <scroll-view scroll-y class="content-scroll">
      <!-- 轮播图 -->
      <swiper 
        v-if="info?.banners && info.banners.length > 0"
        class="store-swiper" 
        :indicator-dots="true" 
        :autoplay="true" 
        :interval="4000" 
        circular
      >
        <swiper-item v-for="(banner, idx) in info.banners" :key="idx">
          <image :src="getBannerUrl(banner)" class="slide-image" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <view class="info-section">
        <view class="store-name">{{ info?.name || '加载中...' }}</view>
        <view class="store-intro-text" v-if="info?.introduction">{{ info.introduction }}</view>
        
        <view class="divider" />

        <view class="detail-item" v-if="info?.contact_phone" @tap="callPhone">
          <nut-icon name="service" size="16" color="#666" />
          <text class="detail-text">联系电话：{{ info.contact_phone }}</text>
          <nut-icon name="rect-right" size="12" color="#ccc" />
        </view>

        <view class="detail-item" v-if="info?.address">
          <nut-icon name="location" size="16" color="#666" />
          <text class="detail-text">地址：{{ info.address }}</text>
        </view>

        <!-- 地图: 仅在非 WEB 环境下显示 -->
        <view class="map-container" v-if="hasLocation && !isWeb">
          <map
            id="store-map"
            style="width: 100%; height: 200px;"
            :longitude="Number(info!.longitude)"
            :latitude="Number(info!.latitude)"
            :scale="16"
            :markers="markers"
            :show-location="true"
            @tap="openLocation"
          />
        </view>

        <view class="divider" v-if="info?.detail" />
        
        <view class="rich-content" v-if="info?.detail">
          <view class="section-title">店铺详情</view>
          <rich-text :nodes="info.detail" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted, computed } from 'vue'
import homeService, { type ShopIntro, type ShopIntroBanner, getUploadUrl } from '../../services/home'

const info = ref<ShopIntro | null>(null)
const isWeb = ref(Taro.getEnv() === Taro.ENV_TYPE.WEB)

onMounted(() => {
  fetchStoreIntro()
})

const fetchStoreIntro = async () => {
  try {
    const { code, data } = await homeService.getShopIntro()
    if (code === 0 && data) {
      info.value = data
    }
  } catch (error) {
    console.error('Fetch store intro failed:', error)
  }
}

const getBannerUrl = (banner: ShopIntroBanner) => {
  return getUploadUrl(banner.material?.file_path)
}

const callPhone = () => {
  if (info.value?.contact_phone) {
    Taro.makePhoneCall({ phoneNumber: info.value.contact_phone })
  }
}

const hasLocation = computed(() => {
  return info.value && info.value.longitude && info.value.latitude
})

const markers = computed(() => {
  if (!hasLocation.value) return []
  return [{
    id: 1,
    longitude: Number(info.value!.longitude),
    latitude: Number(info.value!.latitude),
    title: info.value!.name,
    width: 30,
    height: 30
  }]
})

const openLocation = () => {
  if (!hasLocation.value) return
  Taro.openLocation({
    latitude: Number(info.value!.latitude),
    longitude: Number(info.value!.longitude),
    name: info.value!.name,
    address: info.value!.address
  })
}
</script>

<style lang="scss">
.store-intro {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;

  .content-scroll {
    flex: 1;
    height: 0;
  }

  .store-swiper {
    width: 100%;
    height: 250px;
    
    .slide-image {
      width: 100%;
      height: 100%;
    }
  }

  .info-section {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 0 0 12px 12px;
    
    .store-name {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }
    
    .store-intro-text {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
    
    .divider {
      height: 1px;
      background: #eee;
      margin: 16px 0;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      
      .detail-text {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        color: #333;
      }
    }

    .map-container {
      margin-top: 16px;
      border-radius: 8px;
      overflow: hidden;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
      border-left: 4px solid #fa2c19;
      padding-left: 8px;
    }
    
    .rich-content {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
}
</style>
