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

// 管理员路由组（需要 admin 权限）- 放在前面以防被参数路由捕获（虽然方法不同，但好习惯）
router.post('/brands/admin', adminMiddleware, controller.create);
router.put('/brands/admin/:id', adminMiddleware, controller.update);
router.delete('/brands/admin/:id', adminMiddleware, controller.remove);

// 列表与详情（普通用户权限）
router.get('/brands', paginationQuery(), paginationResponse, controller.list);
router.get('/brands/:id', controller.detail);

export default router;


