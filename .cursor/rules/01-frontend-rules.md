## 前端规则（Vue 3 + TS + Vite）

### 技术栈与基础约定

- 语言：TypeScript，尽量避免 any；必要时注释原因。
- 组件库：Element Plus，二次封装放入 `components/**`。
- 状态管理：Pinia（模块化 stores），仅存储跨页全局状态。
- 路由：Vue Router，路由 meta 承载权限、菜单、面包屑信息。
- 国际化：vue-i18n，所有文案使用 key；新增页面同步补充 i18n。
- 样式：SCSS + BEM；主题在 `src/theme/**` 管理，可切换。

### 目录与命名

- 组件命名使用 PascalCase（文件）与 kebab-case（注册时），公共组件放 `components/`。
- 业务页面放 `views/`，同名复用组件放子目录 `components/`。
- API 定义在 `src/api/**`，按域拆分；类型放 `src/api/types/**`。
- 工具方法放 `components/utils/**` 或 `src/utils/**`，避免循环依赖。

### API 调用与错误处理

- 统一通过 `src/utils/request.ts`（或项目内等价文件）封装 axios。
- 约定请求头 Authorization: `Bearer <token>`；401 触发登出与登录重定向。
- 约定响应结构 `{ code, message, data }`：code=0 视为成功；统一 toast 错误。
- 列表查询使用统一分页参数：`page`、`pageSize`、`keyword`、`sort`。

### 表单与表格

- 表单：使用 Form + 表单项配置驱动；校验采用 Element Plus + 自定义规则。
- 表格：分页、排序、筛选后端驱动；导出使用 `exceljs`（必要时）。
- 上传：使用后端上传 API，限制类型/大小；展示上传进度。

### 权限与菜单

- 路由 meta 标记 `requiresAuth`、`roles`、`permissions`；前置守卫校验。
- 菜单数据来自后端或静态配置，保持路由与菜单元信息一致。
- 按钮级权限通过自定义指令/组件封装。

### 代码质量

- 使用 TS 强类型，导出 API/组件的公共接口显式标注。
- 组件尽量无副作用；拆分可复用逻辑为 hooks（`useXxx.ts`）。
- 提交前保证无 Lint 报错与类型错误；必要时补充注释与自测说明。

### 构建与性能

- 依赖按需引入；大体积依赖开启分包；路由懒加载。
- 图片与静态资源走 CDN 或构建优化；启用缓存与 ETag。
- 避免不必要的深度响应式与大对象传递；适当使用 `defineProps/defineEmits`、`shallowRef` 等。



