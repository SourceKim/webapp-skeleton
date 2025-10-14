<template>
    <el-icon class="collapse-icon" size="14" @click="toggleMenuCollapse">
      <m-svg-icon
        src="@/assets/icon/fold.svg"
        inherited
        :class="{ rotate180: layoutStore.menuCollapse }"
      />
    </el-icon>
  </template>
  
  <script setup>
  import { toRef } from 'vue'
  import { useLayoutStore } from '@/stores/layout'
  import MSvgIcon from '@/components/icon/SvgIcon.vue'
  
  const layoutStore = useLayoutStore()
  
  const menuCollapse = toRef(layoutStore, 'menuCollapse')
  
  function toggleMenuCollapse() {
    menuCollapse.value = !menuCollapse.value
  }
  </script>
  
  <style scoped lang="scss">
  
  .rotate180 {
    transform: rotate(180deg);
  }
  </style>
  