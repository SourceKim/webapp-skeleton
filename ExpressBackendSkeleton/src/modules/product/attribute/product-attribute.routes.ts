import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { ProductAttributeController } from './product-attribute.controller';

const router = Router();
const controller = new ProductAttributeController();

router.use(authMiddleware);

// 查询某 SPU 下的所有属性键（含属性值）
router.get('/attributes/keys', controller.listKeysBySpu);

// 管理员操作
router.use('/attributes/admin', adminMiddleware);
router.post('/attributes/admin/keys', controller.createKey);
router.put('/attributes/admin/keys/:id', controller.updateKey);
router.delete('/attributes/admin/keys/:id', controller.deleteKey);

router.post('/attributes/admin/values', controller.createValue);
router.put('/attributes/admin/values/:id', controller.updateValue);
router.delete('/attributes/admin/values/:id', controller.deleteValue);

export default router;


