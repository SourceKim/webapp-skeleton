import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { NavTabStyle } from '@/interface/navTab'

export type LayoutSize = 'small' | 'default' | 'large'

export type LayoutAnimation = 'slide-right'
| 'slide-left'
| 'el-fade-in-linear'
| 'el-fade-in'
| 'el-zoom-in-center'
| 'el-zoom-in-top'
| 'el-zoom-in-bottom' // 侧边菜单宽度(展开时)，单位px

export const useLayoutStore = defineStore('layout', {
    state: () => ({
        size: useLocalStorage<LayoutSize>('layout-size', 'default'), // 全局布局大小
        widthShrink: useLocalStorage<boolean>('layout-width-shrink', false), // 宽度是否收缩(小宽度设备)
        heightShrink: useLocalStorage<boolean>('layout-height-shrink', false), // 高度是否收缩(矮高度设备)
        mainAnimation: useLocalStorage<LayoutAnimation>('layout-main-animation', 'slide-right'), // 主页面切换动画
        showLogo: useLocalStorage<boolean>('layout-show-logo', true), // 是否显示logo
        menuCollapse: false, // 菜单是否折叠
        menuUniqueOpened: useLocalStorage<boolean>('layout-menu-unique-opened', true), // 菜单是否唯一展开
        showFooter: useLocalStorage<boolean>('layout-show-footer', true), // 是否显示底部
        showNavTabIcon: useLocalStorage<boolean>('layout-show-nav-tab-icon', true), // 是否显示导航标签图标
        settingVisible: false, // 设置是否显示
        navTabStyle: useLocalStorage<NavTabStyle>('layout-nav-tab-style', 'mellow'), // 导航标签样式
        menuWidth: useLocalStorage<number>('layout-menu-width', 200) // 菜单宽度
    }),
    actions: {
    },
})
