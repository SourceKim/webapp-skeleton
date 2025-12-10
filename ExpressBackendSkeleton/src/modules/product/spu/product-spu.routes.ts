import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { ProductSpuController } from './product-spu.controller';

const router = Router();
const controller = new ProductSpuController();

router.use(authMiddleware);

// 列表与详情
router.get('/spu', paginationQuery(), paginationResponse, controller.list);
router.get('/spu/:id', controller.detail);

// 管理员增删改
router.use('/spu/admin', roleMiddleware(ADMIN_ROLE_NAMES));
router.post('/spu/admin', controller.create);
router.put('/spu/admin/:id', controller.update);
router.delete('/spu/admin/:id', controller.remove);
router.post('/spu/admin/:id/generate-skus', controller.generateSkus);

export default router;


