/**
 * 角色常量定义
 * 这些常量应该与数据库中的角色名称保持一致
 */
export const ROLE_NAMES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
} as const;

/**
 * 管理员角色名称列表
 * 用于权限检查
 */
export const ADMIN_ROLE_NAMES = [
    ROLE_NAMES.SUPER_ADMIN,
    ROLE_NAMES.ADMIN,
] as const;
