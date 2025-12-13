import { Router } from 'express';
import { UserController } from '@/modules/user/user.controller';
import { authMiddleware, ensureSelf } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const userController = new UserController();

router.put('/change-password', authMiddleware, userController.changePassword); // 修改密码
router.put('/change-phone', authMiddleware, userController.changePhone); // 修改手机号

router.get('/profile/:id', authMiddleware, ensureSelf, userController.getUser); // 获取当前用户信息（由前端传入 id）
router.get('/stats', authMiddleware, userController.getStats); // 获取用户统计信息
router.put('/profile/:id', authMiddleware, ensureSelf, userController.updateUser); // 更新当前用户信息（由前端传入 id）

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES));

router.get('/admin', paginationQuery(), paginationResponse, userController.getUsers); // 获取所有用户
router.get('/admin/:id', userController.getUser); // 获取指定用户
router.post('/admin', userController.createUser); // 创建用户
router.put('/admin/:id', userController.updateUser); // 更新指定用户
router.delete('/admin/:id', userController.deleteUser); // 删除用户

// 头像上传：调用素材上传后把图片URL写入用户avatar
router.post('/admin/:id/avatar', userController.updateUser); // 简化：前端先上传获取URL，再调用此接口更新 avatar

export default router;
