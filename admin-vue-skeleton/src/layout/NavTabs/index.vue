<script setup lang="ts">
import { nextTick, provide, ref, watch, type Component } from 'vue'
import MellowNavTabs from './MellowNavTabs.vue'
import SquareNavTabs from './SquareNavTabs.vue'
import { useRoute } from 'vue-router'
import { useNavTabStore } from '@/stores/navTab'
import { useLayoutStore } from '@/stores/layout'
import type { NavTabStyle } from '@/interface/navTab'

const route = useRoute()

const tabStyleComp: Record<NavTabStyle, Component> = {
  'mellow': MellowNavTabs,
  'square': SquareNavTabs,
  'default': MellowNavTabs
}

const navTabs = useNavTabStore().navTabs
const layoutStore = useLayoutStore()

const navTabsRef = ref()

/**
 * 根据fullPath移除一个导航tab
 * @param fullPath
 */
function removeTab(fullPath: string) {
  useNavTabStore().removeNavTabByFullPath(fullPath)
}

/**
 * 当前菜单变化或者增加菜单项需将当前菜单页签滚动至可视区域
 */
watch(
  () => [route.fullPath, navTabs.length],
  () => {
    nextTick(() => {
      const dom = navTabsRef.value.getElementsByClassName('active-tab').item(0)
      dom?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      })
    })
  }
)

provide('navTab', {
  removeTab,
})
</script>

<template>
  <div ref="navTabsRef" class="nav-tabs-view" v-if="!layoutStore.heightShrink">
    <component :is="tabStyleComp[layoutStore.navTabStyle]" />
  </div>
</template>

<style scoped lang="scss">
.nav-tabs-view {
  padding: 0 10px;
}
</style>
