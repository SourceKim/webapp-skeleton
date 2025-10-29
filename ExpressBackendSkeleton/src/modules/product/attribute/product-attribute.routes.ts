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
router.use('/attributes', adminMiddleware);
router.post('/attributes/keys', controller.createKey);
router.put('/attributes/keys/:id', controller.updateKey);
router.delete('/attributes/keys/:id', controller.deleteKey);

router.post('/attributes/values', controller.createValue);
router.put('/attributes/values/:id', controller.updateValue);
router.delete('/attributes/values/:id', controller.deleteValue);

export default router;


