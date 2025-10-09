## API 集成规则

### 统一请求封装

- 使用 axios 二次封装：
  - BaseURL 由环境变量控制。
  - 请求拦截：注入 `Authorization` 头（若存在）。
  - 响应拦截：非 `code=0` 统一抛错；401 触发登出与跳转登录。

### 约定参数

- 分页：`page`、`pageSize`、`keyword`、`sort`。
- 列表筛选：使用后端文档中的 Query Filter 规范（参考 `docs/query-filter-guide.md`）。
- 上传：使用 `multipart/form-data`；返回文件的 `url`、`name`、`size`、`type`。

### 端到端契约

- 后端 DTO 与 Swagger 描述保持同步；前端 `types` 与接口响应对齐。
- 对核心接口生成 TS 类型（可用 `openapi-typescript` 或手写维持简洁）。

### 错误与重试

- 对 GET 可配置幂等重试（指数退避，限定重试次数）；
- POST/PUT/DELETE 默认不重试；需要时业务内显式声明。



