import { Router } from 'express';
import { RoleController } from '@/modules/role/role.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new RoleController();

// 所有角色相关路由都需要认证和管理员权限
router.use(authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES));

// 角色管理路由
router.use('/admin', authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES));
router.get('/admin', paginationQuery(), paginationResponse, controller.findAllRoles);
router.get('/admin/:id', controller.findRoleById);
router.post('/admin', controller.createRole);
router.put('/admin/:id', controller.updateRole);
router.delete('/admin/:id', controller.deleteRole);

// 权限分配路由
router.post('/admin/:roleId/permissions', controller.assignPermissionsToRole);
router.post('/admin/users/:userId/roles', controller.assignRolesToUser);

export default router; 