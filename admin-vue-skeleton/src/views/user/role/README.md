# 角色权限管理功能说明

## 功能概述

本模块基于 [Skeleton API 文档](https://apifox.com/apidoc/shared/e8b51452-f67b-4ffd-8593-997eeb77ac36) 实现了完整的角色权限管理功能，包括：

1. **角色列表管理** - 查看、新增、编辑、删除角色
2. **权限分配** - 为角色分配或移除权限
3. **权限搜索** - 在权限分配界面搜索特定权限
4. **批量操作** - 支持批量分配或移除权限
5. **用户角色分配** - 为用户分配角色

## API 接口

### 角色相关接口

```typescript
// 获取所有角色
getRoles(): Promise<RestResponse<PaginatedResponse<Role>>>

// 获取指定角色（包含权限信息）
getRoleDetail(roleId: string): Promise<RestResponse<Role & { permissions: Permission[] }>>

// 创建角色
createRole(data: CreateAndUpdateRoleQueryDto): Promise<RestResponse<Role>>

// 更新指定角色
updateRole(id: string, data: CreateAndUpdateRoleQueryDto): Promise<RestResponse<Role>>

// 删除指定角色
deleteRole(id: string): Promise<RestResponse<Role>>

// 为角色分配权限
assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<RestResponse<any>>

// 为用户分配角色
assignRolesToUser(userId: string, roleIds: string[]): Promise<RestResponse<any>>
```

### 权限相关接口

```typescript
// 获取所有权限
getPermissions(): Promise<RestResponse<PaginatedResponse<Permission>>>

// 获取指定权限
getPermission(id: string): Promise<RestResponse<Permission>>

// 创建权限
createPermission(data: CreateAndUpdatePermissionQueryDto): Promise<RestResponse<Permission>>

// 更新指定权限
updatePermission(id: string, data: CreateAndUpdatePermissionQueryDto): Promise<RestResponse<Permission>>

// 删除指定权限
deletePermission(id: string): Promise<RestResponse<Permission>>
```

### 调用的后端接口

基于 [Skeleton API 文档](https://apifox.com/apidoc/shared/e8b51452-f67b-4ffd-8593-997eeb77ac36) 的接口规范：

#### Role 模块
- `GET /roles/admin` - 获取所有角色
- `GET /roles/admin/{id}` - 获取指定角色（包含权限信息）
- `POST /roles/admin` - 创建角色
- `PUT /roles/admin/{id}` - 更新指定角色
- `DELETE /roles/admin/{id}` - 删除指定角色
- `POST /roles/admin/{roleId}/permissions` - 为角色分配权限
- `POST /users/admin/{userId}/roles` - 为用户分配角色

#### Permission 模块
- `GET /permissions/admin` - 获取所有权限
- `GET /permissions/admin/{id}` - 获取指定权限
- `POST /permissions/admin` - 创建权限
- `PUT /permissions/admin/{id}` - 更新指定权限
- `DELETE /permissions/admin/{id}` - 删除指定权限

## 使用方式

### 1. 编辑角色权限

在角色列表中点击"编辑"按钮，会打开角色编辑对话框，其中包含：

- **基本信息**: 角色名称、描述
- **权限管理**: 可视化的权限分配界面

### 2. 权限分配界面

权限分配界面分为三个区域：

- **左侧**: 可用权限列表
- **中间**: 操作按钮（分配/移除）
- **右侧**: 已分配权限列表

### 3. 操作说明

1. **搜索权限**: 在搜索框中输入关键词，可搜索权限名称、资源、操作等
2. **选择权限**: 勾选要操作的权限
3. **分配权限**: 点击"分配 →"按钮将选中的权限分配给角色
4. **移除权限**: 点击"← 移除"按钮将选中的权限从角色中移除
5. **批量操作**: 
   - "全部分配 →": 将所有可用权限分配给角色
   - "← 全部移除": 移除角色的所有权限

## 技术特性

### 完全符合 API 文档

所有接口调用都严格按照 [Skeleton API 文档](https://apifox.com/apidoc/shared/e8b51452-f67b-4ffd-8593-997eeb77ac36) 的规范实现：

- 使用标准的 REST API 风格
- 统一的请求/响应格式
- 完整的 CRUD 操作支持

### 类型安全

所有组件都使用了严格的 TypeScript 类型定义，避免了 `any` 类型的使用：

```typescript
interface RolePermissionFormProps {
  modelValue: string[]
  handleType: FormHandleType
  roleId?: string
}
```

### 组件化设计

- `RolePermissionForm.vue` - 权限分配组件，可复用
- 支持双向数据绑定，响应式更新
- 集成到表单中作为插槽使用

### 用户体验

- **实时搜索**: 输入关键词立即过滤权限列表
- **视觉反馈**: 清晰的界面布局，操作状态明确
- **错误处理**: 完善的错误处理和用户提示
- **加载状态**: 操作过程中的加载提示

## 文件结构

```
src/views/user/
├── types.ts                           # 类型定义
├── components/
│   ├── RolePermissionForm.vue         # 权限分配组件
│   └── UserPermissionForm.vue         # 用户权限组件
├── role/
│   ├── index.vue                      # 角色列表页面
│   ├── form.vue                       # 角色表单（含权限管理）
│   └── README.md                      # 使用说明
└── permission/
    ├── index.vue                      # 权限列表页面
    └── form.vue                       # 权限表单
```

## 国际化支持

已添加中文翻译：

```typescript
view: {
  role: {
    permissions: '权限管理',
    searchPermissions: '搜索权限...',
    availablePermissions: '可用权限',
    assignedPermissions: '已分配权限',
    assign: '分配',
    remove: '移除',
    assignAll: '全部分配',
    removeAll: '全部移除',
  }
}
```

## 数据流程

### 角色权限分配流程

1. **获取角色详情**: 调用 `GET /roles/admin/{id}` 获取角色及其权限
2. **获取所有权限**: 调用 `GET /permissions/admin` 获取系统中所有权限
3. **计算可用权限**: 从所有权限中排除已分配的权限
4. **分配权限**: 调用 `POST /roles/admin/{roleId}/permissions` 更新角色权限
5. **保存角色**: 调用 `PUT /roles/admin/{id}` 更新角色基本信息

### 用户角色分配流程

1. **获取用户信息**: 调用 `GET /users/admin/{id}` 获取用户详情
2. **获取可用角色**: 调用 `GET /roles/admin` 获取所有角色
3. **分配角色**: 调用 `POST /users/admin/{userId}/roles` 为用户分配角色

## 注意事项

1. **API 规范**: 严格按照 [Skeleton API 文档](https://apifox.com/apidoc/shared/e8b51452-f67b-4ffd-8593-997eeb77ac36) 实现
2. **权限同步**: 编辑角色时会自动加载该角色的现有权限
3. **新增角色**: 新增角色时可以直接分配权限，保存时会同时创建角色和分配权限
4. **权限更新**: 编辑角色权限时，会重新设置该角色的所有权限
5. **错误处理**: 所有 API 调用都包含错误处理，失败时会显示错误提示
6. **接口兼容**: 完全兼容后端 API 文档规范，确保前后端数据交互正确 