/templates 目录下是供后续 vibe coding 使用时候进行参考。

使用说明（Express 模块模板）

- 位置：`templates/express/modules/__kebabName__/`
- 说明：以 `permission` 模块为基线抽象出的 CRUD 模板，包含 `model/dto/service/controller/routes` 与 `docs`。

占位符规则：
- `__kebabName__`: 模块名（短横线/小写），如 `product-category`
- `__kebabNamePlural__`: 复数路由前缀，如 `product-categories`
- `__PascalName__`: 模块名 PascalCase，如 `ProductCategory`

落地步骤（手工或脚本），以 `product-category` 为例：
1) 复制模板到 `src/modules/product-category/`，重命名文件中的 `__kebabName__` 为 `product-category`，`__PascalName__` 为 `ProductCategory`，`__kebabNamePlural__` 为 `product-categories`。
2) 在 `src/configs/database.config.ts` 的 `entities` 中加入 `ProductCategory` 实体。
3) 在 `src/routes.ts` 注册：`router.use(`${API_VERSION}/product-categories`, productCategoryRoutes);`
4) 生成迁移并执行（保持 `synchronize=false`），确保表 `product_categories` 与字段命名为下划线风格。
5) 按需在 `src/docs/` 引入 `docs/product-category.docs.ts`。

注意：
- 路由下 `/admin` 前缀默认挂载 `authMiddleware` 与 `adminMiddleware`。
- 列表接口需接入 `paginationQuery()` 与 `paginationResponse`。
- DTO 校验通过 `req.validate()`。
- 统一异常抛出 `HttpException`，响应结构 `{ code, message, data }`。
