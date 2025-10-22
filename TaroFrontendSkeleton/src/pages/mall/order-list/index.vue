<template>
  <view class="page">
    <view class="nav" v-if="isH5">
      <text class="back" @tap="goBack">返回</text>
      <text class="title">我的订单</text>
    </view>
    <order-list />
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted } from 'vue'
import OrderList from '../components/order-list.vue'

const isH5 = ref(false)
onMounted(() => { isH5.value = Taro.getEnv() === Taro.ENV_TYPE.WEB })

const goBack = () => { Taro.navigateBack({ delta: 1 }) }
</script>

<style lang="scss">
.page { padding-top: 0; }
.nav { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; height: 44px; background: #fff; border-bottom: 1px solid #f0f0f0; }
.nav .back { padding: 0 12px; color: #1677ff; }
.nav .title { flex: 1; text-align: center; font-weight: 600; color: #333; margin-right: 48px; }
</style>


