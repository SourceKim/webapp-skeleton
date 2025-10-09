import { Router } from 'express';
import { MaterialTagController } from './material-tag.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new MaterialTagController();
router.use(authMiddleware);
router.use(adminMiddleware);

// 管理员分类管理API - CRUD
router.get('/admin/', paginationQuery(), paginationResponse, controller.findAllMaterialTags);
router.get('/admin/:id', controller.findMaterialTagById);
router.post('/admin/', controller.createMaterialTag);
router.put('/admin/:id', controller.updateMaterialTag);
router.delete('/admin/:id', controller.deleteMaterialTag);

export default router;