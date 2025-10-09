## WebApp Skeleton

一个开箱即用的全栈骨架，包含前端管理端（Vue 3 + TS + Vite）与后端服务（Express + TS + TypeORM），内置认证、权限、日志、Swagger 文档、分页、文件上传等常用能力，并配套规则文档与更完整的前端示例项目。

### 仓库结构

- `admin-vue-skeleton`: 管理端前端骨架（Element Plus、Pinia、Vue Router、i18n）
- `ExpressBackendSkeleton`: 后端骨架（JWT、RBAC 权限、Winston、Swagger、上传、分页中间件）
- `sk-admin-frontend-skeleton`: 更完整的前端示例与文档站点（可作为约定与最佳实践参考）

### 核心功能

- 认证与权限：JWT 登录、角色/权限点（RBAC），路由与按钮级权限
- 通用中间件：请求日志、错误处理、DTO 校验、分页参数/响应
- 文件上传：Multer 存储，统一元数据返回（url/name/size/type）
- API 文档：swagger-jsdoc + swagger-ui-express，源在 `src/docs/**`
- 统一前端请求封装：axios 拦截器、错误提示与 401 登出
- 规则约束：`.cursor/rules/**` 覆盖编码、API 契约、流程与当前重点

### 技术栈

- 前端：Vue 3、TypeScript、Vite、Element Plus、Pinia、Vue Router、vue-i18n、ExcelJS
- 后端：Express、TypeScript、TypeORM、MySQL、JWT、Winston、Swagger、Multer

### 快速开始

前置依赖：Node.js 20+，MySQL 8+；建议使用 pnpm/yarn。

1) 启动后端（ExpressBackendSkeleton）

```bash
cd ExpressBackendSkeleton
cp .env.example .env    # 如存在示例环境文件，请按需修改数据库/端口/密钥
yarn                    # 或 pnpm i / npm i
yarn dev                # 开发
# 其它
# yarn build            # 构建
# yarn migration:run    # 运行迁移
# yarn seed:admin       # 初始化超管
```

2) 启动前端（admin-vue-skeleton）

```bash
cd admin-vue-skeleton
yarn                    # 或 pnpm i / npm i
yarn dev
```

### 常用脚本

- 前端：`dev`、`build`、`preview`
- 后端：`dev`、`build`、`migration:generate|run|revert|show`、`seed:admin`

### API 文档

- 后端启动后访问 Swagger UI（通常为 `/api-docs`），源文件位于 `ExpressBackendSkeleton/src/docs/**`

### 数据库迁移

- 使用 TypeORM migration 管理表结构：

```bash
cd ExpressBackendSkeleton
yarn migration:generate
yarn migration:run
```

若存在表依赖关系，请调整迁移文件名顺序，确保被依赖表先创建。

### 开发规范与规则

项目规则集中在 `.cursor/rules/**`：

- `00-project-overview.md`: 项目总览与关键位置
- `01-frontend-rules.md`: 前端约定与代码规范
- `02-backend-rules.md`: 后端约定、分层与迁移规范
- `03-admin-rules.md`: 管理端导航/权限/表格表单
- `04-shared-standards.md`: 命名、提交、协议、日志、安全
- `05-api-integration.md`: 请求封装、分页筛选、契约与重试
- `06-development-workflow.md`: 从设计到部署的流程
- `07-current-focus.md`: 当前阶段重点与负责人

### 部署与运维

- 支持 Docker（参考根目录下 `Dockerfile`/`docker-compose.yml` 如存在）
- CI/CD：建议使用 GitHub Actions + 服务器自托管；生产环境务必区分 `.env` 与日志等级

### 许可

MIT


