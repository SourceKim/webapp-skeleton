export interface ImportMetaEnv {
  // 路由的前缀
  readonly VITE_LAYOUT_ROUTE_NAME: string
  // 系统标题
  readonly VITE_TITLE: string
  // ICP备案号
  readonly VITE_ICP_CODE?: string
  // 公安备案号
  readonly VITE_PSB_CODE?: string
  // 版权起始年份
  readonly VITE_COPYRIGHT_YEAR?: string
  // 版权所有者
  readonly VITE_COPYRIGHT_OWNER?: string
}
