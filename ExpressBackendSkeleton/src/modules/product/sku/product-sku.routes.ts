import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { ProductSkuController } from './product-sku.controller';

const router = Router();
const controller = new ProductSkuController();

router.use(authMiddleware);

router.get('/sku', paginationQuery(), paginationResponse, controller.list);
router.get('/sku/:id', controller.detail);

router.use('/sku/admin', adminMiddleware);
router.post('/sku/admin', controller.create);
router.put('/sku/admin/:id', controller.update);
router.delete('/sku/admin/:id', controller.remove);

export default router;


