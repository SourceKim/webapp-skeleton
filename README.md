## 简介

Skeleton 是一个全栈项目骨架，采用 **Monorepo** 架构，包含：
- **ExpressBackendSkeleton**: Express.js + TypeScript 后端服务
- **VueAdminSkeleton**: Vue 3 + Element Plus 管理后台
- **TaroFrontendSkeleton**: Taro + Vue 3 跨平台前端应用
- **packages/**: 共享包目录
  - `@skeleton/shared-utils`: 共享工具函数库
  - `@skeleton/shared-types`: 共享 TypeScript 类型定义

## Monorepo 架构

本项目使用 **pnpm workspaces** 管理多个包和项目，通过共享包实现代码复用。

### 快速开始（推荐）

```bash
# 1. 安装 pnpm（如果还没有）
npm install -g pnpm

# 2. 安装所有依赖
pnpm install

# 3. 构建共享包
pnpm build:shared

# 4. 启动开发服务器
pnpm dev:backend   # 启动后端
pnpm dev:admin     # 启动管理后台
pnpm dev:taro      # 启动 Taro H5
pnpm dev:all       # 启动所有项目（并行）
```

更多 Monorepo 使用说明请查看：
- [快速开始指南](./QUICKSTART.md)
- [Monorepo 使用指南](./MONOREPO.md)
- [迁移指南](./MIGRATION.md)

## 快速开始（传统方式）

### 统一管理脚本

项目根目录提供了统一的管理脚本，可以方便地启动、构建和部署各个子项目。

#### 1. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，配置部署路径
# DEPLOY_PATH_ADMIN=/opt/1panel/www/sites/skeleton-admin.kimsu.fun/index
# DEPLOY_PATH_TARO=/opt/1panel/www/sites/skeleton-web.kimsu.fun/index
```

#### 2. 使用管理脚本

```bash
# 启动开发服务器
./scripts/manage.sh dev backend    # 启动后端
./scripts/manage.sh dev admin       # 启动管理后台
./scripts/manage.sh dev taro        # 启动 Taro H5
./scripts/manage.sh dev all         # 启动所有项目

# 构建项目
./scripts/manage.sh build backend  # 构建后端
./scripts/manage.sh build admin     # 构建管理后台
./scripts/manage.sh build taro      # 构建 Taro H5
./scripts/manage.sh build all       # 构建所有项目

# 部署项目
./scripts/manage.sh deploy admin /path/to/deploy  # 部署管理后台（使用命令行参数）
./scripts/manage.sh deploy taro /path/to/deploy   # 部署 Taro H5（使用命令行参数）
# 或者在 .env 中配置 DEPLOY_PATH_ADMIN 和 DEPLOY_PATH_TARO，然后直接运行：
./scripts/manage.sh deploy admin   # 使用环境变量中的路径
./scripts/manage.sh deploy taro    # 使用环境变量中的路径
```

#### 3. 查看帮助

```bash
./scripts/manage.sh
```

## 部署

### 1. 克隆项目
```bash
git clone <repository-url>
cd Skeleton
```

### 2. 后端部署（ExpressBackendSkeleton）
```bash
cd ExpressBackendSkeleton
yarn install
cp .env.example .env.production.local
# 编辑 .env.production.local 配置数据库、JWT、API 地址等
yarn build
yarn migration:run
yarn start:prod
```

**Docker 部署：**
```bash
docker-compose up -d
```

### 3. 前端移动端部署（TaroFrontendSkeleton）
```bash
cd TaroFrontendSkeleton
npm install
cp .env.example .env.production  # 配置 API 地址
npm run build:weapp  # 微信小程序
# npm run build:h5  # H5
# npm run build:alipay  # 支付宝小程序
```

### 4. 管理后台部署（VueAdminSkeleton）
```bash
cd VueAdminSkeleton
npm install
cp .env.example .env.production  # 配置 API 地址
npm run build
# 将 dist/ 目录部署到静态服务器
```
