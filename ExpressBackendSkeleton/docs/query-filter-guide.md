# 查询筛选功能使用指南

## 概述

项目现已支持通用的查询筛选功能，允许客户端通过 URL 查询参数对列表接口进行灵活的数据筛选。

## 基本用法

### 1. 精确匹配（默认）
```
GET /api/v1/users/admin?filters[username]=john
GET /api/v1/materials/admin?filters[status]=active
```

### 2. 模糊搜索
```
# 区分大小写的模糊匹配
GET /api/v1/users/admin?filters[username][like]=john

# 忽略大小写的模糊匹配
GET /api/v1/users/admin?filters[username][ilike]=JOHN
```

### 3. 包含查询
```
# 单个值包含
GET /api/v1/users/admin?filters[status][in]=active,inactive

# 多个值包含（数组格式）
GET /api/v1/materials/admin?filters[status][in]=published,draft
```

### 4. 排除查询
```
GET /api/v1/users/admin?filters[status][not_in]=banned,deleted
```

### 5. 数值比较
```
# 大于
GET /api/v1/materials/admin?filters[created_at][gt]=2023-01-01

# 大于等于
GET /api/v1/materials/admin?filters[created_at][gte]=2023-01-01

# 小于
GET /api/v1/materials/admin?filters[created_at][lt]=2024-01-01

# 小于等于
GET /api/v1/materials/admin?filters[created_at][lte]=2024-01-01
```

### 6. 范围查询
```
GET /api/v1/materials/admin?filters[created_at][between]=2023-01-01,2024-01-01
```

### 7. 空值检查
```
# 检查字段为空
GET /api/v1/users/admin?filters[email][is_null]=true

# 检查字段不为空
GET /api/v1/users/admin?filters[email][is_not_null]=true
```

## 支持的操作符

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `eq` (默认) | 精确匹配 | `filters[name]=john` |
| `ne` | 不等于 | `filters[status][ne]=deleted` |
| `like` | 模糊匹配 | `filters[name][like]=john` |
| `ilike` | 忽略大小写模糊匹配 | `filters[name][ilike]=john` |
| `in` | 包含 | `filters[status][in]=active,inactive` |
| `not_in` | 不包含 | `filters[status][not_in]=banned` |
| `gt` | 大于 | `filters[age][gt]=18` |
| `gte` | 大于等于 | `filters[age][gte]=18` |
| `lt` | 小于 | `filters[age][lt]=65` |
| `lte` | 小于等于 | `filters[age][lte]=65` |
| `is_null` | 为空 | `filters[email][is_null]=true` |
| `is_not_null` | 不为空 | `filters[email][is_not_null]=true` |
| `between` | 在...之间 | `filters[age][between]=18,65` |

## 实际使用示例

### 用户模块
```bash
# 查找用户名包含 "admin" 的活跃用户
GET /api/v1/users/admin?filters[username][like]=admin&filters[status]=active

# 查找最近注册的用户（7天内）
GET /api/v1/users/admin?filters[created_at][gte]=2024-01-01

# 查找有邮箱且状态不是已删除的用户
GET /api/v1/users/admin?filters[email][is_not_null]=true&filters[status][ne]=deleted
```

### 素材模块
```bash
# 查找特定分类的已发布素材
GET /api/v1/materials/admin?filters[material_category_id]=cat123&filters[status]=published

# 查找文件大小在指定范围内的素材
GET /api/v1/materials/admin?filters[file_size][between]=1000,5000000

# 查找标题包含关键词的素材
GET /api/v1/materials/admin?filters[title][ilike]=design
```

### 角色模块
```bash
# 查找包含特定权限的角色
GET /api/v1/roles/admin?filters[name][like]=admin

# 查找最近创建的角色
GET /api/v1/roles/admin?filters[created_at][gte]=2024-01-01
```

## 与分页和排序结合使用

筛选功能与现有的分页和排序功能完全兼容：

```bash
# 筛选 + 分页 + 排序
GET /api/v1/users/admin?filters[status]=active&page=1&limit=10&sort_by=created_at&sort_order=DESC
```

## 技术实现

### 后端实现
1. **中间件解析**：`paginationQuery` 中间件自动解析 URL 中的筛选参数
2. **筛选构建器**：`QueryFilterBuilder` 工具类负责将筛选参数转换为 TypeORM 查询条件
3. **服务集成**：所有查询服务都已集成筛选功能

### 前端集成建议
```javascript
// 构建筛选参数的工具函数
function buildFilterQuery(filters) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([field, value]) => {
        if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([operator, operatorValue]) => {
                params.append(`filters[${field}][${operator}]`, operatorValue);
            });
        } else if (value !== null && value !== undefined && value !== '') {
            params.append(`filters[${field}]`, value);
        }
    });
    
    return params.toString();
}

// 使用示例
const filters = {
    username: { like: 'john' },
    status: 'active',
    created_at: { gte: '2024-01-01' }
};

const queryString = buildFilterQuery(filters);
// 结果: filters[username][like]=john&filters[status]=active&filters[created_at][gte]=2024-01-01
```

## 注意事项

1. **字段名称**：筛选字段名称必须与数据库字段名称对应
2. **数据类型**：确保筛选值的数据类型与数据库字段类型匹配
3. **性能考虑**：为经常用于筛选的字段建立数据库索引
4. **安全性**：筛选参数会自动进行 SQL 注入防护
5. **分页限制**：每页最大条数限制为 100 条

## 扩展说明

如需添加新的筛选操作符，可以在以下位置进行扩展：
1. `src/modules/common/common.dto.ts` - 添加新的 `FilterOperator` 枚举值
2. `src/utils/query-filter.util.ts` - 在 `applyFilters` 方法中添加新操作符的处理逻辑 