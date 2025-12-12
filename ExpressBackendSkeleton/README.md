# Express Backend Skeleton

## 项目简介
这是一个基于 Express.js 和 TypeScript 的后端骨架项目，集成了完整的用户认证、权限管理、素材管理等常用功能模块。项目采用模块化架构设计，提供了企业级应用开发的基础框架，可以快速进行二次开发和功能扩展。

## 技术栈
* **语言**: TypeScript
* **运行时**: Node.js (≥16.0.0)
* **Web框架**: Express.js
* **数据库**: MySQL
* **ORM**: TypeORM
* **认证**: JWT (JSON Web Token)
* **API文档**: Swagger
* **日志**: Winston
* **文件上传**: Multer
* **容器化**: Docker, Docker Compose
* **包管理**: npm/yarn
* **环境管理**: dotenv

## 核心功能
### 用户系统
- 用户注册与登录
- 用户信息管理
- 用户设置管理
- JWT 认证与鉴权

### 权限系统（RBAC）
- 角色管理（Role）
- 权限管理（Permission）
- 用户角色分配
- 路由权限控制
- 管理员权限管理

### 素材管理系统
- 多媒体文件上传（图片、音频、视频、文档）
- 文本内容管理
- 素材分类管理
- 素材标签系统
- 文件安全存储
- 访问权限控制
- 重复文件检测

### 商品管理系统
- 商品品牌管理（Brand）
- 商品分类管理（Category）
- 商品SPU管理（Standard Product Unit）
- 商品SKU管理（Stock Keeping Unit）
- 商品属性管理（Attribute Key/Value）
- SKU属性关联
- 商品图片关联
- 商品状态管理

### 商城系统
- 购物车管理（Cart）
- 订单管理（Order）
- 订单状态流转（待支付、待发货、已发货、已完成、已取消）
- 订单支付状态管理
- 订单配送状态管理
- 用户地址管理（Address）
- 轮播图管理（Carousel）
- 店铺介绍管理（Shop Intro）

## 项目结构
```
src/
├── configs/              # 配置文件
│   ├── database.config.ts    # 数据库配置
│   ├── env.config.ts         # 环境变量配置
│   └── swagger.config.ts     # Swagger 文档配置
├── modules/              # 业务模块
│   ├── auth/            # 认证模块
│   ├── user/            # 用户模块
│   │   └── address/     # 用户地址管理
│   ├── permission/      # 权限模块
│   ├── role/            # 角色模块
│   ├── material/        # 素材模块
│   │   ├── mateial-category/  # 素材分类
│   │   └── mateial-tag/       # 素材标签
│   ├── product/         # 商品模块
│   │   ├── brand/       # 品牌管理
│   │   ├── category/    # 分类管理
│   │   ├── spu/         # SPU管理
│   │   ├── sku/         # SKU管理
│   │   └── attribute/   # 属性管理
│   ├── mall/            # 商城模块
│   │   ├── cart/        # 购物车
│   │   ├── order/       # 订单
│   │   ├── carousel/    # 轮播图
│   │   └── shop-intro/  # 店铺介绍
│   └── common/          # 通用模块
├── middlewares/         # 中间件
│   ├── auth.middleware.ts        # 认证中间件
│   ├── role.middleware.ts        # 角色验证中间件
│   ├── permission.middleware.ts  # 权限验证中间件
│   ├── dto-validation.middleware.ts  # DTO验证中间件
│   ├── error.middleware.ts       # 错误处理中间件
│   ├── logger.middleware.ts      # 日志中间件
│   ├── paginationQuery.ts        # 分页查询中间件
│   └── paginationResponse.ts     # 分页响应中间件
├── exceptions/          # 异常处理
│   └── http.exception.ts         # HTTP异常类
├── utils/              # 工具函数
│   └── logger.ts       # 日志工具
├── docs/               # API 文档定义
├── types/              # 类型定义
├── routes.ts           # 路由注册
├── app.ts              # Express应用配置
└── server.ts           # 服务器入口
```

## 开发环境搭建

### 前置依赖
- Node.js (≥16.0.0)
- MySQL (≥8.0)
- Docker (可选)

### 1. 克隆项目
```bash
git clone <repository-url>
cd express-backend-skeleton
```

### 2. 安装依赖
```bash
npm install
# 或
yarn install
```

### 3. 环境变量配置
复制环境变量模板文件（如果存在）：
```bash
cp .env.example .env.development.local
```

或者直接创建 `.env.development.local` 文件，编辑环境变量文件，配置数据库连接信息：
```env
# 运行环境
NODE_ENV=development

# 服务配置
PORT=4000
API_VERSION=/api/v1
LOG_LEVEL=debug

# 数据库配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database_name

# JWT 配置
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS 配置（必须提供完整的 URL，包含协议）
CORS_ADMIN_ORIGIN=http://localhost:5173
CORS_APP_ORIGIN=http://localhost:10086
# 可选：自定义 CORS 方法和请求头
# CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
# CORS_HEADERS=Content-Type,Authorization

# 文件上传配置
UPLOADS_PATH=/uploads          # 上传文件访问路径
PUBLIC_PATH=/public            # 静态文件访问路径
MAX_FILE_SIZE=10485760         # 10MB，单位：字节
# 可选：允许的 MIME 类型（逗号分隔）
# ALLOWED_MIME_TYPES=image/*,audio/*,video/*,application/pdf,text/plain

# API 文档配置
API_DOCS_PATH=/api-docs        # Swagger UI 访问路径
API_DOCS_JSON_PATH=/api-docs.json  # Swagger JSON 访问路径
```

### 4. 数据库初始化
运行数据库迁移：
```bash
npm run migration:run
```

创建管理员账号：
```bash
npm run seed:admin
```

**注意**：环境变量文件加载优先级（从高到低）：
1. 系统环境变量（最高优先级）
2. `.env` (基础配置)
3. `.env.local` (本地所有环境通用配置，不提交到版本控制)
4. `.env.${NODE_ENV}` (环境特定配置，如 `.env.development`)
5. `.env.${NODE_ENV}.local` (本地环境特定配置，不提交到版本控制)

推荐使用 `.env.development.local` 或 `.env.production.local` 进行本地配置。

### 5. 启动开发服务器
```bash
npm run dev
```

## 生产环境部署

### 使用 Docker Compose
```bash
# 构建和启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend
```

### 手动部署
```bash
# 构建项目
npm run build

# 启动生产服务
npm start
```

## API 文档
启动服务后，可以通过以下地址访问 API 文档：
- 开发环境: `http://localhost:4000/api-docs`
- 生产环境: `https://your-domain.com/api-docs`

## API 路由说明

### 认证相关 (`/api/v1/auth`)
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/refresh` - 刷新 Token

### 用户相关 (`/api/v1/users`)
- `GET /users/profile/:id` - 获取用户信息
- `PUT /users/profile/:id` - 更新用户信息
- `PUT /users/change-password` - 修改密码
- `PUT /users/change-phone` - 修改手机号
- `GET /users/stats` - 获取用户统计信息
- `GET /users/admin` - 管理员：获取用户列表（分页）
- `POST /users/admin` - 管理员：创建用户
- `PUT /users/admin/:id` - 管理员：更新用户
- `DELETE /users/admin/:id` - 管理员：删除用户

### 地址相关 (`/api/v1/addresses`)
- `GET /addresses` - 获取地址列表
- `GET /addresses/:id` - 获取地址详情
- `POST /addresses` - 创建地址
- `PUT /addresses/:id` - 更新地址
- `DELETE /addresses/:id` - 删除地址
- `PUT /addresses/:id/default` - 设置默认地址

### 权限相关 (`/api/v1/permissions`)
- `GET /permissions/admin` - 获取权限列表（分页）
- `GET /permissions/admin/:id` - 获取权限详情
- `POST /permissions/admin` - 创建权限
- `PUT /permissions/admin/:id` - 更新权限
- `DELETE /permissions/admin/:id` - 删除权限

### 角色相关 (`/api/v1/roles`)
- `GET /roles/admin` - 获取角色列表（分页）
- `GET /roles/admin/:id` - 获取角色详情
- `POST /roles/admin` - 创建角色
- `PUT /roles/admin/:id` - 更新角色
- `DELETE /roles/admin/:id` - 删除角色
- `POST /roles/admin/:roleId/permissions` - 分配权限给角色
- `POST /roles/admin/users/:userId/roles` - 分配角色给用户

### 素材相关 (`/api/v1/materials`)
- `POST /materials/upload` - 上传素材
- `GET /materials/admin` - 管理员：获取素材列表（分页）
- `GET /materials/admin/:id` - 管理员：获取素材详情
- `PUT /materials/admin/:id` - 管理员：更新素材
- `DELETE /materials/admin/:id` - 管理员：删除素材

### 商品相关 (`/api/v1/products`)
#### 品牌 (Brand)
- `GET /products/brands` - 获取品牌列表（分页）
- `GET /products/brands/:id` - 获取品牌详情
- `POST /products/brands/admin` - 管理员：创建品牌
- `PUT /products/brands/admin/:id` - 管理员：更新品牌
- `DELETE /products/brands/admin/:id` - 管理员：删除品牌

#### 分类 (Category)
- `GET /products/categories` - 获取分类列表（分页）
- `GET /products/categories/:id` - 获取分类详情
- `POST /products/categories/admin` - 管理员：创建分类
- `PUT /products/categories/admin/:id` - 管理员：更新分类
- `DELETE /products/categories/admin/:id` - 管理员：删除分类

#### SPU (Standard Product Unit)
- `GET /products/spu` - 获取SPU列表（分页）
- `GET /products/spu/:id` - 获取SPU详情
- `POST /products/spu/admin` - 管理员：创建SPU
- `PUT /products/spu/admin/:id` - 管理员：更新SPU
- `DELETE /products/spu/admin/:id` - 管理员：删除SPU
- `POST /products/spu/admin/:id/generate-skus` - 管理员：生成SKU

#### SKU (Stock Keeping Unit)
- `GET /products/sku` - 获取SKU列表（分页）
- `GET /products/sku/:id` - 获取SKU详情
- `POST /products/sku/admin` - 管理员：创建SKU
- `PUT /products/sku/admin/:id` - 管理员：更新SKU
- `DELETE /products/sku/admin/:id` - 管理员：删除SKU

#### 属性 (Attribute)
- `GET /products/attributes/keys` - 获取属性键列表
- `POST /products/attributes/admin/keys` - 管理员：创建属性键
- `PUT /products/attributes/admin/keys/:id` - 管理员：更新属性键
- `DELETE /products/attributes/admin/keys/:id` - 管理员：删除属性键
- `POST /products/attributes/admin/values` - 管理员：创建属性值
- `PUT /products/attributes/admin/values/:id` - 管理员：更新属性值
- `DELETE /products/attributes/admin/values/:id` - 管理员：删除属性值

### 商城相关

#### 购物车 (`/api/v1/cart`)
- `GET /cart` - 获取购物车列表
- `POST /cart` - 添加商品到购物车
- `PUT /cart/:id` - 更新购物车项
- `DELETE /cart/:id` - 删除购物车项
- `GET /admin/carts` - 管理员：获取购物车列表（分页）

#### 订单 (`/api/v1/orders`)
- `GET /orders` - 获取我的订单列表
- `GET /orders/:id` - 获取订单详情
- `POST /orders` - 创建订单（从购物车）
- `GET /orders/preview` - 订单预览
- `PUT /orders/:id/cancel` - 取消订单
- `PUT /orders/:id/receive` - 确认收货
- `GET /admin/orders` - 管理员：获取订单列表（分页）
- `GET /admin/orders/:id` - 管理员：获取订单详情
- `PUT /admin/orders/:id/delivery` - 管理员：发货
- `PUT /admin/orders/:id/status` - 管理员：更新订单状态

#### 轮播图 (`/api/v1/mall`)
- `GET /mall/carousels` - 获取轮播图列表（分页）
- `GET /mall/carousels/:id` - 获取轮播图详情
- `POST /mall/admin/carousels` - 管理员：创建轮播图
- `PUT /mall/admin/carousels/:id` - 管理员：更新轮播图
- `DELETE /mall/admin/carousels/:id` - 管理员：删除轮播图

#### 店铺介绍 (`/api/v1/mall`)
- `GET /mall/shop-intro` - 获取店铺介绍
- `PUT /mall/admin/shop-intro` - 管理员：更新店铺介绍

## 数据库管理

### 生成迁移文件
```bash
npm run migration:generate -- -n YourMigrationName
```

### 运行迁移
```bash
npm run migration:run
```

### 回滚迁移
```bash
npm run migration:revert
```

### 查看迁移状态
```bash
npm run migration:show
```

## 可用脚本

### 开发相关
- `npm run dev` - 启动开发服务器（使用 nodemon 自动重启）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器（需要先构建）
- `npm run start:prod` - 启动生产服务器（设置 NODE_ENV=production）

### 代码质量
- `npm run lint` - 检查代码格式
- `npm run lint:fix` - 自动修复代码格式问题
- `npm run format` - 格式化代码

### 数据库相关
- `npm run migration:generate` - 生成迁移文件
- `npm run migration:create` - 创建空的迁移文件
- `npm run migration:run` - 运行数据库迁移
- `npm run migration:revert` - 回滚最后一次迁移
- `npm run migration:show` - 查看迁移状态
- `npm run seed:admin` - 创建/重置管理员账号
- `npm run sql:clean` - 清理数据库（谨慎使用）

## 中间件说明

### 认证中间件 (`auth.middleware.ts`)
- 验证 JWT Token
- 解析用户信息并挂载到 `req.user`
- 未认证请求返回 401

### 角色中间件 (`role.middleware.ts`)
- 验证用户是否具有指定角色
- 支持多个角色，用户只需拥有其中一个即可通过
- 使用方式：`roleMiddleware(['admin', 'super_admin'])`
- 未授权返回 403

### 权限中间件 (`permission.middleware.ts`)
- 验证用户是否具有指定权限
- 支持多个权限，用户需要拥有所有权限才能通过
- 使用方式：`checkPermissions(['user:read', 'user:write'])`
- 未授权返回 403

### 分页中间件
- `paginationQuery()`: 解析分页查询参数（page, limit, sort_by, sort_order, filters）
- `paginationResponse`: 格式化分页响应数据

### 错误处理中间件 (`error.middleware.ts`)
- 统一处理应用错误
- 区分 HttpException 和系统错误
- 记录错误日志
- 返回标准错误响应格式

### 日志中间件 (`logger.middleware.ts`)
- `requestTracingMiddleware`: 为每个请求生成唯一追踪ID
- `httpLoggerMiddleware`: 记录HTTP请求和响应日志

## 开发规范

### 代码格式化
```bash
# 检查代码格式
npm run lint

# 自动修复格式问题
npm run lint:fix

# 格式化代码
npm run format
```

### 新增模块流程
1. 确认业务逻辑和接口设计
2. 创建 Model (Entity) 
3. 创建 DTO 和验证规则
4. 实现 Service 业务逻辑
5. 实现 Controller 控制器
6. 配置 Routes 路由
7. 添加中间件和权限控制
8. 更新 API 文档

### 代码规范
- 使用 TypeScript，尽量避免使用 `any` 类型
- 组件命名：使用小写字母，单词之间用连字符连接
- 代码关键逻辑和所有 API 必须添加注释，使用 JSDoc 规范
- 简单原则：尽量使用简单的方式实现功能，避免过度设计
- 使用统一的 Winston 日志工具，区分 DEBUG/WARNING/INFO/ERROR 等级

## 安全特性

### 认证与授权
- JWT Token 认证
- 基于角色的访问控制（RBAC）
- 路由级别的权限控制
- 管理员权限分离

### 数据安全
- 密码 bcrypt 加密存储
- SQL 注入防护（TypeORM）
- 文件上传类型限制
- 文件大小限制

### 请求安全
- CORS 跨域控制
- 请求体大小限制
- 文件上传安全检查

## 监控和日志

### 日志系统
- 使用 Winston 进行日志管理
- 按级别分类存储（DEBUG/INFO/WARN/ERROR）
- 请求链路追踪
- 错误堆栈记录

### 日志级别
- `DEBUG`: 调试信息
- `INFO`: 一般信息
- `WARN`: 警告信息
- `ERROR`: 错误信息

## 功能特性

### 已实现的功能模块
- ✅ 用户认证与授权
- ✅ 角色权限管理（RBAC）
- ✅ 素材管理系统
- ✅ 文件上传与存储
- ✅ 商品管理系统（品牌、分类、SPU、SKU、属性）
- ✅ 商城系统（购物车、订单、轮播图、店铺介绍）
- ✅ 用户地址管理
- ✅ API 文档生成（Swagger）
- ✅ 日志记录（Winston）
- ✅ 错误处理
- ✅ 数据库迁移（TypeORM）
- ✅ Docker 支持
- ✅ 分页查询支持
- ✅ 请求追踪
- ✅ DTO 数据验证

### 扩展建议
基于此骨架项目，你可以快速添加以下功能：
- 消息推送系统
- 缓存层（Redis）
- 队列系统
- 搜索功能
- 数据统计与分析
- 第三方集成（支付、短信等）

## 常见问题

### Q: 如何重置管理员密码？
A: 运行 `npm run seed:admin` 会重新创建管理员账号

### Q: 如何修改上传文件大小限制？
A: 修改环境变量 `MAX_FILE_SIZE` 的值（单位：字节）

### Q: 如何添加新的文件类型支持？
A: 在 `src/modules/material/material.util.ts` 中修改 `isAllowedFileType` 函数

### Q: 如何自定义项目名称？
A: 修改 `package.json` 中的 `name` 字段和相关配置

### Q: 如何添加新的角色？
A: 在数据库中手动添加角色记录，或通过管理员接口创建角色

### Q: 如何配置 CORS？
A: 修改环境变量 `CORS_ORIGINS`、`CORS_METHODS`、`CORS_HEADERS`

### Q: 订单状态有哪些？
A: 订单状态包括：`UNPAID`（待支付）、`TO_BE_SHIPPED`（待发货）、`SHIPPED`（已发货）、`COMPLETED`（已完成）、`CANCELLED`（已取消）

### Q: 如何清理数据库？
A: 运行 `npm run sql:clean` 脚本（谨慎使用，会清空所有数据）

## 版本历史
- v0.1.0: 初始版本，包含基础用户认证、权限管理、素材管理功能
- v0.2.0: 新增商品管理系统（品牌、分类、SPU、SKU、属性）
- v0.3.0: 新增商城系统（购物车、订单、轮播图、店铺介绍）

## 贡献指南
1. Fork 本项目
2. 创建特性分支
3. 提交代码变更
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT License