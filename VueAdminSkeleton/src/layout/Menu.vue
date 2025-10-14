<template>
      <el-scrollbar>
        <el-menu class="el-menu"
            :collapse="layoutStore.menuCollapse"
            :default-active="route.fullPath"
            :unique-opened="layoutStore.menuUniqueOpened"
            :collapse-transition="false"
            :on-select="onSelect"
            :router="true"
        >
          <template v-for="menu in useMenuStore().treeMenus" :key="menu.id">
            <MenuNode :menu-item="menu" />
          </template>
        </el-menu>
      </el-scrollbar>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menu'
import { useLayoutStore } from '@/stores/layout'
import { useRouter, useRoute } from 'vue-router'
import { defineComponent, type PropType } from 'vue'
import type { FlatMenu, TreeMenu } from '@/interface/menu'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import MIcon from '@/components/icon/Icon.vue'
import { h } from 'vue'

const layoutStore = useLayoutStore()
const router = useRouter()
const route = useRoute()

/**
 * 递归生成层级菜单
 */
const MenuNode = defineComponent({
    name: 'MenuNode',
    props: {
        menuItem: {
            type: Object as PropType<TreeMenu>,
            required: true
        }
    },
    setup(props: { menuItem: TreeMenu }) {
        const menu = props.menuItem

        // 只有目录和菜单渲染，其他类型不渲染
        if (!['dir', 'menu'].includes(menu.type)) return

        const icon = h(MIcon, { value: menu.icon })
        // 子项包含目录和菜单才视为菜单目录
        const children = menu.children?.filter((i: TreeMenu) => ['dir', 'menu'].includes(i.type))
        if (children && children.length > 0) {
          return () => h(
            ElSubMenu,
            {
                index: menu.fullPath ?? '',
            },
            {
                title: () => [icon, h('span', menu.title)],
                default: () => children.map((i: TreeMenu) => h(MenuNode, { menuItem: i }))
            }
          )
        } else {
          return () => h(
            ElMenuItem,
            {
              index: menu.fullPath ?? '',
            },
            {
              default: () => [icon, h('span', menu.title)]
            }
          )
        }
    }
})

// 选中菜单
function onSelect(fullPath: string) {
    console.log('fullPath', fullPath)
    // 小屏设备收起菜单
    if (layoutStore.widthShrink) layoutStore.menuCollapse = true
    const menu = useMenuStore().menus.find((i: FlatMenu) => i.fullPath === fullPath)
    if (!menu) return
    if (menu.handleType === 'outer') {
        globalThis.open(menu.outerUrl)
    } else {
        if (menu.fullPath) {
            router.push(menu.fullPath)
        }
    }
}
</script>

<style scoped lang="scss">
.el-menu {
    width: 100%;
}
</style>