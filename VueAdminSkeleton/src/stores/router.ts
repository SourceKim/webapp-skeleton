import { defineStore } from 'pinia'
import type { Menu } from '@/interface/menu.d'
import { useMenuStore } from './menu'
import { useRouter, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import camelCase from 'lodash/camelCase'
import { useAuthStore } from './auth'
import type { NavTab } from '@/interface/navTab'
import { useNavTabStore } from './navTab'
import { useTitle } from '@vueuse/core'
import { ENV } from '@/utils/env'
import { logDebug, logError } from '@/utils/logger'

export const useRouterStore = defineStore('router', () => {

    // 使用固定的布局路由名称，与 static.ts 中一致
    const layoutRouteName = ENV.LAYOUT_ROUTE_NAME
    const router = useRouter()
    const navTabs = useNavTabStore().navTabs

    router.beforeEach(async (to, from, next) => {
        logDebug("路由守卫触发 - 目标路径:", undefined, { targetPath: to.path, fromPath: from.path })
        let loginState = useAuthStore().loginState
        let token = useAuthStore().token
        
        logDebug("导航状态", undefined, { loginState, hasToken: !!token })

        // 如果是刷新页面，确保路由已经初始化
        if (token && !loginState) {
            logDebug("检测到页面刷新，确保路由已初始化")
            const res = await useAuthStore().tokenLogin()
            logDebug("Token 登录结果", undefined, { success: res })
            loginState = useAuthStore().loginState
            next(to.fullPath)
            return
        }

        let path: string | undefined = to.path
        
        // 登录失败，跳转登录页
        if (loginState != 'success') {
            logDebug("登录失败，跳转登录页")
            path = '/login'
        } else { // 登录成功的 cases
            // 如果目标页为根目录或登录页，则跳转至首个菜单路由
            if (to.path === '/' || to.path === '/login') { 
                const firstRoute = useMenuStore().getFirstRoute()
                if (firstRoute?.fullPath) {
                    path = firstRoute.fullPath
                } else {
                    path = '/admin/home'
                }
            }
        }

        // 确定最终要导航的路径
        logDebug("最终导航路径", undefined, { finalPath: path, currentPath: to.path })
        if (!path) {
            next()
            return
        }
        if (path !== to.path) {
            next(path)
        } else {
            next()
        }
    })

      // 路由跳转成功后钩子，设置当前路由信息，navTabs等，浏览器标题等
    router.afterEach((guard: RouteLocationNormalized) => {
        logDebug('路由跳转成功后钩子', undefined, { path: guard.path, fullPath: guard.fullPath })
        const fullPath = guard.fullPath
        const tab = navTabs.find((i: NavTab) => i.fullPath === fullPath)
        // 如果不存在，则添加tab
        if (!tab && guard.fullPath.startsWith(`/${ENV.LAYOUT_ROUTE_NAME}/`))
        navTabs.push({
            title: guard.meta.title as string,
            fullPath: guard.fullPath,
            componentName: guard.meta.componentName as string,
            cache: guard.meta.cache as boolean,
            icon: guard.meta.icon as string
        })
        // 设置浏览器标题
        let tit = ENV.TITLE
        if (guard.meta.title) tit = guard.meta.title + '-' + tit
        useTitle(tit)
    })

    function jumpTo(path: string) {
        router.push(path)
    }

    function initDynamicRoutes() {
        logDebug('初始化动态路由')
        const viewsComponents = import.meta.glob('@/views/**/*.vue')

            // 检查布局路由是否已存在
        if (!router.hasRoute(layoutRouteName)) {
            router.addRoute({
            name: layoutRouteName,
            path: `/${layoutRouteName}`,
                component: () => import('@/layout/index.vue')
            })
        }
        
        // 处理菜单的 fullPath，但不重复添加已存在的路由
        const menus = useMenuStore().menus
        menus.forEach((i: Menu) => {
            logDebug('处理菜单', undefined, { menuId: i.id, menuName: i.name })
            const levelArr = useMenuStore().getMenuLevelArr(i.id)
            const path = levelArr.map(i => i.path).join('/')
            const fullPath = `/${layoutRouteName}/${path}`
            i.fullPath = fullPath
            useMenuStore().setFullpathForTreeMenuItem(i.id, fullPath)
            
            if (i.type === 'menu' && i.handleType && ['route', 'iframe'].includes(i.handleType)) {
                const name = levelArr.map(i => i.name).join('')
                // 如果路由已存在，则不添加
                if (router.hasRoute(name)) { 
                    logError(`路由已存在: ${name}`, undefined, { routeName: name, fullPath })
                    return
                }
                const componentName = camelCase(fullPath)

                const dynamicRoute: RouteRecordRaw = {
                    name: name,
                    path: fullPath,
                    component: async () => {
                        // 检查组件是否存在
                        if (!i.component) {
                            throw new Error(`组件不存在: ${i.component}`)
                        }
                        const component = viewsComponents[i.component]
                        logDebug('加载组件', undefined, { component: i.component, componentName })
                        if (!component) {
                            throw new Error(`组件不存在: ${i.component}`)
                        }
                        return component().then((comp: any) => ({
                            ...comp.default,
                            name: componentName
                        }))
                    },
                    meta: {
                        title: i.title,
                        icon: i.icon,
                        cache: i.cache,
                        componentName: componentName,
                        component: i.component
                    }
                }
                logDebug('添加动态路由', undefined, { routeName: name, fullPath })
                router.addRoute(layoutRouteName, dynamicRoute)
                logDebug('路由列表', undefined, { routes: router.getRoutes().map(r => r.path) })
            }
        })
    }
    return {
        initDynamicRoutes,
        jumpTo
    }
})  