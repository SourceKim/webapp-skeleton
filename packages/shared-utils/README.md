# @skeleton/shared-utils

Skeleton 项目共享工具函数库，包含环境变量工具、验证工具等通用功能。

## 目录结构

```
shared-utils/
├── src/
│   ├── env/              # 环境变量管理工具
│   │   └── index.ts
│   ├── validation/       # 表单验证工具
│   │   └── index.ts
│   └── index.ts          # 统一导出入口
├── package.json
└── tsconfig.json
```

## 安装

在 Monorepo 中，此包会自动通过 workspace 协议链接，无需手动安装。

**注意**：`dotenv` 已作为根目录的公共依赖，所有项目都可以直接使用。

## 使用

### 环境变量工具（Node.js 环境）

完整的环境变量管理工具，包含加载、读取和打印功能。

```typescript
import { 
  loadEnv, 
  getEnv, 
  getEnvOptional, 
  getEnvNumber, 
  getEnvBoolean, 
  getEnvArray,
  printAllEnv 
} from '@skeleton/shared-utils/env'

// 1. 加载环境变量（在应用启动时调用）
const loadedFiles = loadEnv()
console.log('已加载的环境文件:', loadedFiles)

// 2. 获取必需的环境变量（不存在则报错）
const port = getEnv('PORT', '服务器端口号')
const dbPassword = getEnv('MYSQL_PASSWORD', 'MySQL 密码', undefined, true) // 允许空字符串

// 3. 获取可选的环境变量
const apiKey = getEnvOptional('API_KEY')

// 4. 获取数字类型的环境变量
const maxSize = getEnvNumber('MAX_FILE_SIZE', '最大文件大小', 10485760)

// 5. 获取布尔类型的环境变量
const enableCache = getEnvBoolean('ENABLE_CACHE', '是否启用缓存', false)

// 6. 获取数组类型的环境变量（逗号分隔）
const allowedOrigins = getEnvArray('CORS_ORIGINS', '允许的来源', ['http://localhost:3000'])

// 7. 打印所有环境变量（开发环境）
if (process.env.NODE_ENV === 'development') {
  printAllEnv() // 默认隐藏敏感信息
  // printAllEnv({ maskSensitive: false }) // 显示敏感信息
}
```

详细使用说明请查看 [环境变量工具使用指南](./ENV_USAGE.md)

### 验证工具

```typescript
import { validate, datatype, FieldRule } from '@skeleton/shared-utils/validation'

// 定义验证规则
const rules: FieldRule[] = [
  {
    prop: 'username',
    rules: [
      { required: true, message: '用户名不能为空' },
      { minLength: 3, maxLength: 20, message: '用户名长度必须在 3-20 个字符之间' }
    ]
  },
  {
    prop: 'email',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { pattern: datatype.email, message: '邮箱格式不正确' }
    ]
  },
  {
    prop: 'age',
    rules: [
      { required: true, message: '年龄不能为空' },
      { type: 'number', message: '年龄必须是数字' },
      { min: 18, max: 100, message: '年龄必须在 18-100 之间' }
    ]
  }
]

// 验证表单数据
const formData = {
  username: 'john',
  email: 'john@example.com',
  age: 25
}

const result = await validate(formData, rules)

if (result.success) {
  console.log('验证通过')
} else {
  console.log('验证失败:', result.errFields)
}
```

### 常用验证正则表达式

```typescript
import { datatype } from '@skeleton/shared-utils/validation'

// 使用预定义的验证正则
datatype.mobile      // 手机号（中国大陆）
datatype.email       // 邮箱
datatype.url         // URL
datatype.idCard      // 身份证号（18位）
datatype.chinese     // 中文
datatype.number      // 数字
datatype.positiveInteger  // 正整数
```

## API 文档

### 环境变量工具

#### 加载功能
- `loadEnv(options?)` - 加载环境变量文件
  - `options.cwd` - 工作目录，默认为 `process.cwd()`
  - `options.nodeEnv` - 运行环境，如果不提供则从环境变量或文件中读取
  - `options.override` - 是否覆盖已存在的环境变量，默认 `false`

#### 读取功能
- `getEnv(key, description?, defaultValue?, allowEmpty?)` - 获取环境变量（必需，不存在则报错）
- `getEnvOptional(key)` - 获取环境变量（可选）
- `getEnvNumber(key, description?, defaultValue?)` - 获取数字类型的环境变量
- `getEnvBoolean(key, description?, defaultValue?)` - 获取布尔类型的环境变量
- `getEnvArray(key, description?, defaultValue?)` - 获取数组类型的环境变量（逗号分隔）

#### 打印功能
- `printAllEnv(options?)` - 打印所有环境变量
  - `options.maskSensitive` - 是否隐藏敏感信息（默认 `true`）
  - `options.filter` - 过滤函数，返回 `true` 表示显示该环境变量
  - `options.output` - 输出方式：`'console'`（默认）、`'object'`、`'string'`

### 验证工具

- `validate(formData, fieldRules)` - 表单验证主函数
- `fieldValid(fieldRule, value, formData?)` - 单个字段验证
- `ruleValid(rule, value, formData?)` - 单个规则验证
- `validateRequired(value, message?)` - 验证必填项
- `validateType(value, type, message?)` - 验证数据类型
- `validatePattern(value, pattern, message?)` - 验证正则表达式
- `validateMaxLength(value, maxLength, message?)` - 验证最大长度
- `validateMinLength(value, minLength, message?)` - 验证最小长度
- `validateMin(value, min, message?)` - 验证最小值
- `validateMax(value, max, message?)` - 验证最大值
- `validateItemList(value, itemList, message?)` - 验证选项列表

## 添加新的工具模块

1. 在 `src/` 目录下创建新的目录，例如 `src/logger/`
2. 在新目录中创建 `index.ts` 文件
3. 在 `src/index.ts` 中导出新模块：
   ```typescript
   export * from './logger'
   ```
4. 在 `tsup.config.ts` 中添加新的入口点（如果需要单独导出）：
   ```typescript
   entry: {
     index: 'src/index.ts',
     env: 'src/env/index.ts',
     validation: 'src/validation/index.ts',
     logger: 'src/logger/index.ts'  // 新增
   }
   ```
5. 在 `package.json` 的 `exports` 中添加导出配置（如果需要单独导出）

## 开发

```bash
# 构建
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```

## 注意事项

1. **仅适用于 Node.js 环境**：环境变量工具使用 `process.env` 和 Node.js 文件系统 API，仅适用于后端项目。

2. **前端项目**：前端项目应使用各自框架的环境变量读取方式：
   - VueAdminSkeleton: `import.meta.env` (Vite)
   - TaroFrontendSkeleton: `process.env` (由 Taro 处理)

3. **dotenv 依赖**：`dotenv` 已作为根目录的公共依赖，所有项目都可以直接使用，无需单独安装。
