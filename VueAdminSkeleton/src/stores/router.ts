import { defineStore } from 'pinia'
import type { Menu, TreeMenu } from '@/interface/menu.d'
import { useMenuStore } from './menu'
import { useRouter, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import camelCase from 'lodash/camelCase'
import { useAuthStore } from './auth'
import type { NavTab } from '@/interface/navTab'
import { useNavTabStore } from './navTab'
import { useTitle } from '@vueuse/core'

export const useRouterStore = defineStore('router', () => {

    // 使用固定的布局路由名称，与 static.ts 中一致
    const layoutRouteName = import.meta.env.VITE_LAYOUT_ROUTE_NAME
    const router = useRouter()
    const navTabs = useNavTabStore().navTabs

    router.beforeEach(async (to, from, next) => {
        console.log("路由守卫触发 - 目标路径:", to.path, "来源路径:", from.path)
        let loginState = useAuthStore().loginState
        let token = useAuthStore().token
        
        console.log("导航状态 - 登录状态:", loginState, "Token:", token)

        // 如果是刷新页面，确保路由已经初始化
        if (token && !loginState) {
            console.log("检测到页面刷新，确保路由已初始化")
            const res = await useAuthStore().tokenLogin()
            console.log("Token 登录结果:", res)
            loginState = useAuthStore().loginState
            next(to.fullPath)
            return
        }

        let path: string | undefined = to.path
        
        // 登录失败，跳转登录页
        if (loginState != 'success') {
            console.log("登录失败，跳转登录页")
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
        console.log("最终导航路径:", path, "当前请求路径:", to.path)
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
        console.log('路由跳转成功后钩子', guard)
        const fullPath = guard.fullPath
        const tab = navTabs.find((i: NavTab) => i.fullPath === fullPath)
        // 如果不存在，则添加tab
        if (!tab && guard.fullPath.startsWith(`/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/`))
        navTabs.push({
            title: guard.meta.title as string,
            fullPath: guard.fullPath,
            componentName: guard.meta.componentName as string,
            cache: guard.meta.cache as boolean,
            icon: guard.meta.icon as string
        })
        // 设置浏览器标题
        let tit = import.meta.env.VITE_TITLE
        if (guard.meta.title) tit = guard.meta.title + '-' + tit
        useTitle(tit)
    })

    function jumpTo(path: string) {
        router.push(path)
    }

    function initDynamicRoutes() {
        console.log('初始化动态路由')
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
            console.log('菜单:', i)
            const levelArr = useMenuStore().getMenuLevelArr(i.id)
            const path = levelArr.map(i => i.path).join('/')
            const fullPath = `/${layoutRouteName}/${path}`
            i.fullPath = fullPath
            useMenuStore().setFullpathForTreeMenuItem(i.id, fullPath)
            
            if (i.type === 'menu' && i.handleType && ['route', 'iframe'].includes(i.handleType)) {
                const name = levelArr.map(i => i.name).join('')
                // 如果路由已存在，则不添加
                if (router.hasRoute(name)) { 
                    console.error(`路由已存在: ${name}`)
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
                        console.log('组件:', component)
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
                console.log('添加动态路由', dynamicRoute)
                router.addRoute(layoutRouteName, dynamicRoute)
                console.log('路由列表:', router.getRoutes())
            }
        })
    }
    return {
        initDynamicRoutes,
        jumpTo
    }
})  