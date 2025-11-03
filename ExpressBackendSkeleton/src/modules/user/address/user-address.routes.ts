import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { UserAddressController } from './user-address.controller';

const router = Router();
const controller = new UserAddressController();

// 用户端：需登录
router.use(authMiddleware);

router.get('/', controller.list);
router.get('/:id', controller.detail);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.put('/:id/default', controller.setDefault);

// 管理端：需管理员
router.use('/admin', adminMiddleware);
router.get('/admin', paginationQuery(), paginationResponse, controller.adminList);
router.get('/admin/:id', controller.adminDetail);
router.put('/admin/:id', controller.adminUpdate);
router.delete('/admin/:id', controller.adminRemove);

export default router;


