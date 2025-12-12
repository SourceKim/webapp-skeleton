# 修复 CommonJS 兼容性问题

## 问题描述

`shared-types` 包最初只生成了 ES Module 格式，导致后端项目（使用 CommonJS）无法正确导入，出现以下错误：

```
SyntaxError: Unexpected token 'export'
```

## 解决方案

### 1. 使用 tsup 构建工具

将构建工具从 `tsc` 改为 `tsup`，可以同时生成 CommonJS 和 ES Module 两种格式。

### 2. 更新配置文件

**tsup.config.ts:**
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],  // 同时生成 CJS 和 ESM
  dts: true,              // 生成类型定义文件
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: []
})
```

**package.json:**
- 更新构建脚本：`"build": "tsup"`
- 添加 tsup 依赖：`"tsup": "^8.0.0"`
- 修复 exports 顺序：`types` 应该在 `import` 和 `require` 之前

### 3. 生成的文件

构建后会生成：
- `dist/index.js` - CommonJS 格式（供 Node.js/后端使用）
- `dist/index.mjs` - ES Module 格式（供前端使用）
- `dist/index.d.ts` - TypeScript 类型定义文件

## 验证

### CommonJS 导入测试
```bash
node -e "const { UserStatus } = require('@skeleton/shared-types'); console.log(UserStatus);"
# 输出: { ACTIVE: 'active', INACTIVE: 'inactive', BANNED: 'banned' }
```

### TypeScript 类型导入
```typescript
// 后端代码中
import { UserStatus, type User } from '@skeleton/shared-types';
// ✅ 正常工作
```

## 注意事项

1. **枚举值**：枚举在运行时是 JavaScript 对象，可以正常导入使用
2. **类型定义**：接口和类型只在编译时存在，运行时不存在，这是正常的
3. **导出内容**：运行时只能访问枚举值，类型定义通过 `.d.ts` 文件提供类型检查

## 相关文件

- `tsup.config.ts` - tsup 构建配置
- `package.json` - 包配置和构建脚本
- `dist/index.js` - CommonJS 输出
- `dist/index.mjs` - ES Module 输出
- `dist/index.d.ts` - TypeScript 类型定义
