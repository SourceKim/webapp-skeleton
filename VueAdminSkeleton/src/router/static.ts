import Layout from '@/layout/index.vue'

export const staticRoutes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '系统登录'
        }
    },
    {
        path: '/' + import.meta.env.VITE_LAYOUT_ROUTE_NAME + '/personal-center',
        name: 'personal-center',
        component: () => import('@/views/personal-center/index.vue'),
        meta: {
          title: '个人中心',
          cache: true,
          icon: 'el|user',
          componentName: 'personalCenter'
        }
    },  
    {
        path: '',
        name: '',
        component: Layout,
        children: [
            // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
            {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                component: () => import('@/views/not-found/index.vue'),
                meta: {
                title: 'Not Found',
                icon: 'local|/src/assets/icon/404.svg'
                }
            },
        ]
    }
]
