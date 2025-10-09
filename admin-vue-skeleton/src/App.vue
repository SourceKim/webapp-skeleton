<template>
  <!-- 全局主题，国际化等配置 -->
  <el-config-provider :locale="locale" :size="layoutStore.size" :button="btnConfig">
    <router-view :class="rootClass" v-slot="{ Component }">
      <transition :name="layoutStore.mainAnimation" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <SettingDrawer />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { getLocale } from '@/i18n'
import { useLocaleStore } from '@/stores/locale'
import { useLayoutStore } from '@/stores/layout'
import { flatMenus } from '@/menu'
import { useMenuStore } from '@/stores/menu'
import { useRouterStore } from '@/stores/router'
import SettingDrawer from '@/layout/SettingDrawer.vue'
// 语言包
const localeStore = useLocaleStore()
const locale = computed(() => {
  const locale = getLocale(localeStore.locale).locale
  return locale
})
const layoutStore = useLayoutStore()
const btnConfig = reactive({
  autoInsertSpace: false
})

// 设置菜单 & router
const menuStore = useMenuStore()
menuStore.setMenus(flatMenus)
const routerStore = useRouterStore()
routerStore.initDynamicRoutes()

const rootClass = computed(() => {
  return {
    'width-shrink-layout': layoutStore.widthShrink,
    'height-shrink-layout': layoutStore.heightShrink
  }
})
</script>
