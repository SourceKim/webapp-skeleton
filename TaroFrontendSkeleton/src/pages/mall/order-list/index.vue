<template>
  <view class="page">
    <nut-navbar title="我的订单" left-show safe-area-inset-top @click-back="goBack" />
    <view class="content">
      <order-list />
    </view>
  </view>
  
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { } from 'vue'
import OrderList from '../components/order-list.vue'

const goBack = () => { Taro.navigateBack({ delta: 1 }) }
</script>

<style lang="scss">
.page { padding-top: 0; }
.content { padding: 12px; }
</style>


