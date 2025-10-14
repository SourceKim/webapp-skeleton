import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoutes } from './static'

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRoutes
})

// 添加调试信息
console.log('路由初始化完成，当前路由列表:', router.getRoutes().map(r => r.path))

export default router