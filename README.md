## 简介

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
