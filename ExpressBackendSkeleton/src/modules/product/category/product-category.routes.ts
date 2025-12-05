import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { ProductCategoryController } from './product-category.controller';

const router = Router();
const controller = new ProductCategoryController();

router.use(authMiddleware);

// 列表和详情（用户/管理员可访问）
router.get('/categories', paginationQuery(), paginationResponse, controller.list);
router.get('/categories/:id', controller.detail);

// 管理员增删改
router.use('/categories/admin', adminMiddleware);
router.post('/categories/admin', controller.create);
router.put('/categories/admin/:id', controller.update);
router.delete('/categories/admin/:id', controller.remove);

export default router;


