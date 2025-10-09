import { Router } from 'express';
import { UserController } from '@/modules/user/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const userController = new UserController();

// 普通用户 API - 需要认证
router.get('/profile', authMiddleware, userController.getUser); // 获取当前用户信息

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);

router.get('/admin', paginationQuery(), paginationResponse, userController.getUsers); // 获取所有用户
router.get('/admin/:id', userController.getUser); // 获取指定用户
router.post('/admin', userController.createUser); // 创建用户
router.put('/admin/:id', userController.updateUser); // 更新指定用户
router.delete('/admin/:id', userController.deleteUser); // 删除用户

export default router; 