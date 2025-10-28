import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { ProductBrandController } from './product-brand.controller';

const router = Router();
const controller = new ProductBrandController();

// 所有品牌接口需登录
router.use(authMiddleware);

// 列表与详情（管理员/用户均可）
router.get('/brands', paginationQuery(), paginationResponse, controller.list);
router.get('/brands/:id', controller.detail);

// 管理员增删改
router.use('/brands/admin', adminMiddleware);
router.post('/brands/admin', controller.create);
router.put('/brands/admin/:id', controller.update);
router.delete('/brands/admin/:id', controller.remove);

export default router;


