<template>
  <el-icon class="icon-style" @click="isDark = !isDark">
    <m-svg-icon :src="isDark ? Sun : Moon" />
  </el-icon>
</template>
<script setup>
import { toRef } from 'vue'
import Sun from '@/assets/icon/sun.svg'
import Moon from '@/assets/icon/moon.svg'
import { useThemeStore } from '@/stores/theme'
import MSvgIcon from '@/components/icon/SvgIcon.vue'

const themeStore = useThemeStore()
const isDark = toRef(themeStore, 'darkMode')
</script>
<style scoped>
.icon-style {
  cursor: pointer;
}
</style>
