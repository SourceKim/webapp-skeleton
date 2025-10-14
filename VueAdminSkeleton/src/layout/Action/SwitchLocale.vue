<template>
  <el-dropdown trigger="click" @command="handleCommand" style="padding: 0">
    <div class="switch-locale-view">
      <component :is="menus[localeStore.locale].icon" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(menu, key) in menus"
          :command="key"
          :key="key"
          :icon="menu.icon"
          :style="key === localeStore.locale ? 'color: var(--el-color-primary)' : ''"
        >
          {{ menu.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="jsx">
import { locales } from '@/i18n'
import { useI18n } from 'vue-i18n'
import { switchLocale } from '@/api/user'
import { useLocaleStore } from '@/stores/locale'
import { useAuthStore } from '@/stores/auth'
import MSvgIcon from '@/components/icon/SvgIcon.vue'
import { ElIcon } from 'element-plus'

const menus = locales.reduce((obj, i) => {
  const svgIcon = () => h(MSvgIcon, { src: i.icon, inherited: true })
  const icon = () => h(ElIcon,  svgIcon)
  obj[i.key] = {
    label: i.label,
    icon
  }
  return obj
}, {})

const localeStore = useLocaleStore()
const authStore = useAuthStore()
const i18n = useI18n()

//切换语言
async function handleCommand(key) {
  const locale = locales.find((i) => i.key === key)
  if (authStore.token != '' && authStore.token != undefined) {
    await switchLocale(
      {
        locale: locale.key,
        localeLabel: locale.label
      },
      {
        errorMsg: i18n.t('system.locale.switchLocaleError')
      }
    )
  }
  i18n.locale.value = key
  localeStore.setLocale(key)
}
</script>
<style scoped lang="scss">
.switch-locale-view {
  min-width: 16px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
