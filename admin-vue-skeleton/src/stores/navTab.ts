import { defineStore } from 'pinia'
import type { NavTab } from '@/interface/navTab'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useNavTabStore = defineStore('navTab', ()  => {
    const navTabs = ref<NavTab[]>([])
    const route = useRoute()
    const router = useRouter()

      // 刷新当前页签
    const refresh = ref<boolean>()
  
    // 缓存的组件名称
    const keepAliveComponentNameList = computed(() => {
      return navTabs.value
        .filter((i) => {
          if (refresh.value && i.fullPath === route.fullPath) return false
          return i.cache
        })
        .map((i) => i.componentName as string)
    })

    function setRefresh(val: boolean) {
      refresh.value = val
    }

    // 通过fullPath移除navTab
    function removeNavTabByFullPath(fullPath: string) {
      const index = navTabs.value.findIndex((i) => i.fullPath === fullPath)
      return removeNavTabByIndex(index)
    }

    // 通过index移除navTab
    function removeNavTabByIndex(index: number) {
      const currentMenu = navTabs.value[index]
      navTabs.value.splice(index, 1)
      // 如果删除了当前激活的路由，则需要自动跳转到右边的tab
      if (currentMenu.fullPath === route.fullPath) {
        // 如果是最右边路由，则需要左移一位
        if (index > navTabs.value.length - 1) index--
        return router.push(navTabs.value[index].fullPath)
      }
    }

    return {
        navTabs,
        removeNavTabByFullPath,
        removeNavTabByIndex,
        keepAliveComponentNameList,
        setRefresh,
        refresh
    }
})  