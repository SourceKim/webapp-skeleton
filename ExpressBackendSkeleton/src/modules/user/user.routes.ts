import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '@/modules/user/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const userController = new UserController();

// 普通用户 API - 需要认证
// 仅允许用户访问/修改自己的资料
const ensureSelf = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.id !== req.params.id) {
        res.status(403).json({ code: 403, message: '禁止访问' });
        return;
    }
    next();
};

router.get('/profile/:id', authMiddleware, ensureSelf, userController.getUser); // 获取当前用户信息（由前端传入 id）
router.put('/profile/:id', authMiddleware, ensureSelf, userController.updateUser); // 更新当前用户信息（由前端传入 id）

// 管理员 API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);

router.get('/admin', paginationQuery(), paginationResponse, userController.getUsers); // 获取所有用户
router.get('/admin/:id', userController.getUser); // 获取指定用户
router.post('/admin', userController.createUser); // 创建用户
router.put('/admin/:id', userController.updateUser); // 更新指定用户
router.delete('/admin/:id', userController.deleteUser); // 删除用户

// 头像上传：调用素材上传后把图片URL写入用户avatar
router.post('/admin/:id/avatar', userController.updateUser); // 简化：前端先上传获取URL，再调用此接口更新 avatar

export default router; 