## 后端规则（Express + TS + TypeORM）

参考工程规则与后端习惯：字段命名 snake_case（如 `created_at`）；环境变量大写（`MY_ENV_VAR`）。

### 目录结构与分层

- 分层：routes → controllers → services → repositories/entities → dtos → middlewares → utils。
- 模块化：每个业务在 `src/modules/<domain>` 下聚合实体、服务、控制器、路由。
- 配置：`.env*` + `src/configs/**`；日志 `logger.config.ts`；Swagger `swagger.config.ts`。

### REST API 与权限

- API 遵循 RESTful，区分 admin 与非 admin 路径（如 `/admin/**`）。
- 中间件：`auth.middleware.ts`（JWT 鉴权）、`role.middleware.ts`、`permission.middleware.ts`。
- 分页：`paginationQuery.ts` + `paginationResponse.ts` 统一参数与响应。

### 实体与迁移

- 主键使用 string（uuid/nanoid），在业务层生成；所有实体继承 BaseEntity（`id`、`created_at`、`updated_at`、`deleted_at`）。
- 使用 `class-validator` 注解 DTO/实体属性校验。
- 在 `database.config.ts` 注册实体；通过 TypeORM CLI 生成 migration，
  如存在依赖，调整迁移文件名，确保被依赖表先创建。

### 错误处理与日志

- 统一异常基类：`exceptions/HttpException.ts`，错误中间件统一输出 `{ code, message }`。
- 日志：Winston，按等级分文件（DEBUG/INFO/WARN/ERROR），记录模块与入参（请求/响应）。

### 文档与类型

- 使用 swagger-jsdoc + swagger-ui-express 暴露接口文档；保持与 DTO、响应类型一致。
- 导出公共类型放置 `src/types/**`；禁止随意使用 `any`。

### 开发与运维

- 本地开发：`yarn dev`；构建：`yarn build`；
- 数据库迁移：`yarn migration:generate|run|revert|show`；初始化超管：`yarn seed:admin`。
- 环境隔离：区分开发/测试/生产 `.env`，敏感信息只放环境变量。



