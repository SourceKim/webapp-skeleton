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

## 项目结构
```
src/
├── configs/           # 配置文件
├── modules/           # 业务模块
│   ├── auth/         # 认证模块
│   ├── user/         # 用户模块
│   ├── permission/   # 权限模块
│   ├── role/         # 角色模块
│   ├── material/     # 素材模块
│   └── common/       # 通用模块
├── middlewares/      # 中间件
├── exceptions/       # 异常处理
├── utils/           # 工具函数
├── docs/            # API 文档
└── types/           # 类型定义
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
复制环境变量模板文件：
```bash
cp .env.example .env.development.local
```

编辑环境变量文件，配置数据库连接信息：
```env
# 数据库配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database_name

# JWT 配置
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# 服务配置
PORT=4000
NODE_ENV=development

# 文件上传配置
UPLOADS_PATH=/uploads  # 上传文件访问路径
MAX_FILE_SIZE=10485760  # 10MB
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
- ✅ API 文档生成
- ✅ 日志记录
- ✅ 错误处理
- ✅ 数据库迁移
- ✅ Docker 支持

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

## 版本历史
- v0.1.0: 初始版本，包含基础用户认证、权限管理、素材管理功能

## 贡献指南
1. Fork 本项目
2. 创建特性分支
3. 提交代码变更
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT License