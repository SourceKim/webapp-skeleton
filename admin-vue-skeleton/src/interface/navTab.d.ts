export interface NavTab {
    //标题
    title: string
    //路由全路径
    fullPath: string
    //是否缓存
    cache?: boolean
    // 组件名
    componentName?: string
    // 图标
    icon?: string
  }

  export type NavTabStyle = 'default' | 'square' | 'mellow'