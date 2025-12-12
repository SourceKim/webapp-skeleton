# Monorepo 使用指南

本项目已配置为 Monorepo 结构，使用 pnpm workspaces 管理多个包和项目。

## 目录结构

```
Skeleton/
├── packages/                    # 共享包目录
│   ├── shared-utils/           # 共享工具函数库
│   └── shared-types/           # 共享类型定义库
├── ExpressBackendSkeleton/     # Express 后端项目
├── VueAdminSkeleton/           # Vue 管理后台项目
├── TaroFrontendSkeleton/       # Taro 前端项目
├── package.json                # 根 package.json
└── pnpm-workspace.yaml         # pnpm workspace 配置
```

## 快速开始

### 1. 安装依赖

```bash
# 在根目录安装所有依赖（包括所有子项目和共享包）
pnpm install
```

### 2. 构建共享包

```bash
# 构建所有共享包
pnpm build:shared

# 或者构建单个包
cd packages/shared-utils
pnpm build
```

### 3. 开发

```bash
# 启动单个项目
pnpm dev:backend   # 启动后端
pnpm dev:admin     # 启动管理后台
pnpm dev:taro      # 启动 Taro H5

# 启动所有项目（并行）
pnpm dev:all
```

### 4. 构建

```bash
# 构建单个项目
pnpm build:backend
pnpm build:admin
pnpm build:taro

# 构建所有项目
pnpm build:all
```

## 使用共享包

### 在 ExpressBackendSkeleton 中使用

```typescript
// 使用环境变量工具
import { getEnv, getEnvOptional } from '@skeleton/shared-utils/env'

const port = getEnv('PORT', '服务器端口号')
const apiKey = getEnvOptional('API_KEY')

// 使用验证工具
import { validate, FieldRule } from '@skeleton/shared-utils/validation'

const rules: FieldRule[] = [
  {
    prop: 'username',
    rules: [{ required: true, message: '用户名不能为空' }]
  }
]

// 使用共享类型
import type { ApiResponse, User } from '@skeleton/shared-types'
```

### 在 VueAdminSkeleton 中使用

```typescript
// 使用验证工具（前端也可以使用）
import { validate, datatype, FieldRule } from '@skeleton/shared-utils/validation'

// 使用共享类型
import type { ApiResponse, PaginationResponse, User } from '@skeleton/shared-types'
```

### 在 TaroFrontendSkeleton 中使用

```typescript
// 使用验证工具
import { validate, FieldRule } from '@skeleton/shared-utils/validation'

// 使用共享类型
import type { ApiResponse, User } from '@skeleton/shared-types'
```

## 添加新的共享包

1. 在 `packages` 目录下创建新包目录
2. 创建 `package.json`，设置 `name` 为 `@skeleton/包名`
3. 创建必要的配置文件（`tsconfig.json`、构建配置等）
4. 在需要使用的项目中添加依赖：
   ```json
   {
     "dependencies": {
       "@skeleton/包名": "workspace:*"
     }
   }
   ```
5. 运行 `pnpm install` 安装依赖

## 工作流程

### 开发新功能

1. 如果功能是通用的，考虑添加到 `packages/shared-utils` 或创建新的共享包
2. 在共享包中开发并测试
3. 构建共享包：`pnpm build:shared`
4. 在项目中使用共享包的功能

### 更新共享包

1. 修改共享包代码
2. 构建共享包：`pnpm build:shared`
3. 使用该共享包的项目会自动使用最新版本（workspace 协议）

### 发布（如果需要）

如果将来需要发布到 npm：

1. 更新共享包的版本号
2. 构建共享包
3. 发布到 npm（需要配置 npm 账号）

## 优势

1. **代码复用** - 公共代码只需维护一份
2. **类型安全** - TypeScript 类型可以在项目间共享
3. **统一管理** - 依赖版本统一管理，避免冲突
4. **开发效率** - 修改共享代码后，所有项目自动更新
5. **构建优化** - 可以并行构建多个项目

## 注意事项

1. **共享包构建** - 修改共享包代码后，需要重新构建才能在其他项目中使用
2. **循环依赖** - 避免共享包之间的循环依赖
3. **版本管理** - 使用 `workspace:*` 协议，始终使用本地最新版本
4. **环境差异** - 某些工具函数可能只适用于特定环境（如 Node.js 环境的 `getEnv`）

## 常见问题

### Q: 为什么修改了共享包代码，项目中没有生效？

A: 需要重新构建共享包：`pnpm build:shared`

### Q: 如何在开发时自动构建共享包？

A: 可以在共享包中使用 watch 模式：`cd packages/shared-utils && pnpm dev`，或者使用根目录的并行命令。

### Q: 可以发布到 npm 吗？

A: 可以，但需要：
1. 移除 `private: true`
2. 配置 npm 账号和发布权限
3. 使用正常的版本号而不是 `workspace:*`

### Q: 如何迁移现有代码到共享包？

A: 参考以下步骤：
1. 识别可以共享的代码（工具函数、类型定义等）
2. 将代码移动到对应的共享包
3. 更新原项目的导入路径
4. 测试确保功能正常
