<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in menuStore.activeMenuArr" :key="item.fullPath">
      <div class="tag-content">
        <m-icon v-show="layoutStore.showNavTabIcon && item.icon" class="tab-icon" :value="item.icon" />
        {{ item.title }}
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { useLayoutStore } from '@/stores/layout'
import { useMenuStore } from '@/stores/menu'
import MIcon from '@/components/icon/Icon.vue'

defineOptions({
  name: 'DefaultBreadcrumb'
})
const layoutStore = useLayoutStore()
const menuStore = useMenuStore()
</script>
<style scoped lang="scss">
.tag-content {
  display: flex;
  align-items: center;

  .tab-icon {
    display: inline-block;
    margin-right: 0.5em;
  }
}
</style>
