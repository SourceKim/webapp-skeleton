<template>
  <view class="subpage-layout">
    <view class="subpage-header">
      <view class="left" @tap="onBack">返回</view>
      <view class="title">{{ title }}</view>
      <view class="right" v-if="showHome" @tap="onHome">首页</view>
      <view class="right" v-else></view>
    </view>
    <view class="subpage-content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
const props = defineProps<{ title: string; showHome?: boolean; homePath?: string }>()

const onBack = () => {
  const pages = Taro.getCurrentPages?.() as any[] | undefined
  if (pages && pages.length > 1) {
    Taro.navigateBack()
  } else {
    Taro.switchTab({ url: props.homePath || '/pages/general/index' })
  }
}

const onHome = () => {
  Taro.switchTab({ url: props.homePath || '/pages/general/index' })
}
</script>

<style lang="scss">
.subpage-layout { min-height: 100vh; display: flex; flex-direction: column; }
.subpage-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.left, .right { color: #1677ff; }
.title { font-weight: bold; }
.subpage-content { padding: 16px; }
</style>


