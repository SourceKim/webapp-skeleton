## 项目总览

本仓库包含三个主要部分：

- admin-vue-skeleton：Vue 3 + TypeScript + Vite 管理端骨架（Element Plus、Pinia、Vue Router、i18n）。
- ExpressBackendSkeleton：Express + TypeScript + TypeORM 后端骨架（JWT、RBAC 权限、Winston 日志、Swagger、上传、分页中间件）。
- sk-admin-frontend-skeleton：更完整的前端示例与文档站点（可作为约定与最佳实践的参考实现）。

### 架构关系

- 前端通过统一请求封装（`src/utils/request.ts` 或 `src/api/**`）访问后端 REST API。
- 后端采用模块化分层（controllers / services / dtos / middlewares / modules / routes），数据库由 TypeORM 管理并通过 Migration 保持结构一致。
- 认证使用 JWT，权限采用 RBAC（角色-权限点）。

### 运行环境

- Node.js：建议 v20+（后端 engines.node >=16）。
- 数据库：MySQL（mysql2 + TypeORM）。
- 容器化：内置 Dockerfile 与 docker-compose.yml。

### 重要目录/文件

- 后端 API 文档：`ExpressBackendSkeleton/src/docs/**`（通过 swagger-jsdoc 生成，UI 一般为 `/api-docs`）。
- 分页/查询：`ExpressBackendSkeleton/src/middlewares/paginationQuery.ts`、`paginationResponse.ts`，以及 `docs/query-filter-guide.md`。
- 前端 API 层：`admin-vue-skeleton/src/api/**` 与 `admin-vue-skeleton/src/utils/request.ts`。
- 主题与样式：`admin-vue-skeleton/src/styles/**`、`src/theme/**`。

### 常用脚本

- 前端：
  - 开发：`yarn dev`
  - 构建：`yarn build`
  - 预览：`yarn preview`
- 后端：
  - 开发：`yarn dev`
  - 构建：`yarn build`
  - 迁移：`yarn migration:generate|run|revert|show`
  - 初始化超管：`yarn seed:admin`

### 目标

- 提供可直接扩展的生产级骨架：清晰目录与规范、可靠中间件与日志、完备 API 文档与鉴权体系。
- 将跨端约定沉淀为规则文件，降低沟通成本与认知负担。



