<template>
  <view class="store-intro">
    <nut-navbar title="店铺介绍" left-show @on-click-back="goBack" />
    <view class="content">
      <text>店铺介绍内容建设中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

const goBack = () => {
  Taro.navigateBack()
}
</script>

<style lang="scss">
.store-intro {
  .content {
    padding: 20px;
    text-align: center;
    color: #666;
  }
}
</style>

