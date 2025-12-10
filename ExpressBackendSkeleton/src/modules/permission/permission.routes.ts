import { Router } from 'express';
import { PermissionController } from '@/modules/permission/permission.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new PermissionController();

// 权限相关路由 - 需要认证和管理员权限
router.use(authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES));

// 权限管理路由
router.get('/admin', paginationQuery(), paginationResponse, controller.findAllPermissions);
router.get('/admin/:id', controller.findPermissionById);
router.post('/admin', controller.createPermission);
router.put('/admin/:id', controller.updatePermission);
router.delete('/admin/:id', controller.deletePermission);

export default router; 