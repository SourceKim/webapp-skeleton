export type menuType = 'menu' | 'button' | 'dir'
export type menuHandleType = 'route' | 'iframe' | 'outer'

interface Menu {
    id: string
    path: string
    name: string
    component?: string // 组件路径，如果是 dir 类型，则不需要设置
    handleType?: menuHandleType // 菜单类型，如果是 dir 类型，则不需要设置
    type: menuType
    title: string
    cache: boolean
    icon: string // 菜单图标，比如 el|menu
    fullPath?: string // 完整路径，用于路由跳转，由路由生成，无需主动设置
    outerUrl?: string // 外链地址，用于外链跳转，只有 handleType 为 outer 时有效
}

export interface FlatMenu extends Menu {
    parentId?: string
}

export interface TreeMenu extends Menu {
    children: TreeMenu[]
}