import { defineStore } from 'pinia'
import type { FlatMenu, TreeMenu } from '@/interface/menu.d'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export const useMenuStore = defineStore('menu', () => {
    const menus = ref<FlatMenu[]>([])
    const menusObj = ref<{ [id: string]: TreeMenu }>({})
    const treeMenus = ref<TreeMenu[]>([])
    const route = useRoute()

      // 当前激活的菜单组
    const activeMenuArr = computed(() => {
        const menu = menus.value.find((i) => i.fullPath === route.fullPath)
        if (menu) return getMenuLevelArr(menu.id)
        return [route.meta]
    })

    // 获取菜单id的层级数组
    function getMenuLevelArr(id: string): FlatMenu[] {
        const arr: FlatMenu[] = []
        let currentMenu: FlatMenu | undefined = menusObj.value[id]
        while (currentMenu) {
        arr.unshift(currentMenu)
        currentMenu = menusObj.value[currentMenu.parentId!]
        }
        return arr
    }

      // 获取当前用户菜单首个路由
    function getFirstRoute() {
        const arr = [...treeMenus.value]
        while (arr.length) {
            const menu = arr.shift()
            if (!menu) return undefined
            if (menu.type === 'menu' && menu.fullPath) return menu
            if (menu.children?.length) {
                arr.unshift(...menu.children)
            }
        }
        return undefined
    }

    const setMenus = (menusList: FlatMenu[]) => {
        menus.value = menusList
        // 构建菜单对象
        menusObj.value = {}
        menusList.forEach(i => {
            const m: TreeMenu = {
                ...i,
                children: []
            }
            menusObj.value[i.id] = m
        })
        // 转为树形结构
        const tmpTreeMenus: TreeMenu[] = []
        menusList.forEach((i: FlatMenu) => {
            if (i.parentId) {
                const parent = tmpTreeMenus.find((j: TreeMenu) => j.id === i.parentId)
                if (parent) {
                    parent.children.push({
                        ...i,
                        children: []
                    })
                }
            } else {
                tmpTreeMenus.push({
                    ...i,
                    children: []
                })
            }
        })
        treeMenus.value = tmpTreeMenus
    }

    function setFullpathForTreeMenuItem(menuId: string, fullPath: string) {
        function setFullpathForTreeMenuItems(items: TreeMenu[], fullPath: string) {
            items.forEach((i: TreeMenu) => {
                if (i.id === menuId) {
                    i.fullPath = fullPath
                    return
                } else if (i.children?.length) {
                    setFullpathForTreeMenuItems(i.children, fullPath)
                }
            })
        }
        setFullpathForTreeMenuItems(treeMenus.value, fullPath)
    }

    return {
        menus, // 菜单列表, 用于路由生成
        treeMenus, // 菜单树, 用于菜单渲染
        setMenus,
        getMenuLevelArr,
        getFirstRoute,
        setFullpathForTreeMenuItem
    }
})