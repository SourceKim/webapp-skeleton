<template>
  <view class="index">
    <text>Hello world!</text>
  </view>
  
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Page loaded.')
})
</script>

<style lang="scss" scoped>
.index {
}
</style>


