<template>
  <div ref="scrollbar">
    <el-scrollbar height="100%" :style="`--main-height: ${scrollerSize.height}px;`">
      <router-view v-slot="{ Component, route }">
        <transition :name="layoutStore.mainAnimation" mode="out-in">
          <keep-alive :include="navTabStore.keepAliveComponentNameList">
            <component v-if="!navTabStore.refresh" :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useNavTabStore } from '@/stores/navTab'
import { ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useLayoutStore } from '@/stores/layout'

defineOptions({
  name: 'LayoutMain'
})
const navTabStore = useNavTabStore()
const layoutStore = useLayoutStore()

const scrollbar = ref()
// 刷新当前页签
watch(
  () => navTabStore.refresh,
  () => {
    setTimeout(() => {
      navTabStore.setRefresh(false)
    }, 300)
  }
)

const scrollerSize = ref(useElementSize(scrollbar))
</script>
<style lang="scss"></style>
