## 共享标准（前后端通用）

### 编码与命名

- TypeScript 为主，避免 any；必要时注释原因与边界。
- 命名统一：
  - 数据库/后端字段使用 snake_case：`created_at`、`updated_at`。
  - 环境变量全大写：`MY_ENV_VAR`。
  - 权限点命名：`<domain>.<action>`，如 `user.create`。

### 提交与分支

- Git 分支：`main`（稳定） / `develop`（集成） / `feature/*` / `fix/*` / `chore/*`。
- Commit 信息遵循 Conventional Commits：`feat:`、`fix:`、`docs:`、`refactor:`、`chore:`、`test:` 等。

### 接口协议

- 认证：JWT，前端请求头 `Authorization: Bearer <token>`。
- 统一响应：`{ code, message, data }`，`code=0` 表成功；分页使用 `{ items, total, page, pageSize }`。
- 时间与时区：后端使用 UTC 存储，前端按本地或设定时区展示；统一 ISO8601。

### 日志与监控

- 后端：Winston 分级日志，携带模块、请求 id、入参与响应摘要。
- 前端：关键操作点埋点与错误上报；区分用户行为与技术错误。

### 错误码与异常

- 约定业务错误码区间（如 1000-1999 用户、2000-2999 订单等）；
- 后端抛出统一异常并被错误中间件捕获，返回标准结构；前端弹出统一错误提示。

### 安全

- 身份认证：令牌过期续签策略、登出清理、跨端登录处理。
- 输入校验：前后端均进行校验；文件上传限制类型/大小；避免 XSS/CSRF。
- 配置与密钥：全部走环境变量；严禁提交到仓库。



