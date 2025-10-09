<template>
  <m-svg-icon
    @click="layoutStore.settingVisible = true"
    class="icon-style"
    :src="LayoutSetting"
    inherited
  />
</template>
<script setup>
import { useLayoutStore } from '@/stores/layout'
import MSvgIcon from '@/components/icon/SvgIcon.vue'
import LayoutSetting from '@/assets/icon/layoutSetting.svg'

defineOptions({
  name: 'ActionSetting'
})
const layoutStore = useLayoutStore()
</script>
<style scoped lang="scss">
.icon-style {
  width: 18px;
  height: 18px;
}
</style>