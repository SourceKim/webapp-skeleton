import { Router } from 'express';
import { MaterialCategoryController } from '@/modules/material/mateial-category/material-category.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new MaterialCategoryController();
router.use(authMiddleware);
router.use(roleMiddleware(ADMIN_ROLE_NAMES));

// 管理员分类管理API - CRUD
router.get('/admin/', paginationQuery(), paginationResponse, controller.findAllMaterialCategories);
router.get('/admin/:id', controller.findMaterialCategoryById);
router.post('/admin/', controller.createMaterialCategory);
router.put('/admin/:id', controller.updateMaterialCategory);
router.delete('/admin/:id', controller.deleteMaterialCategory);

export default router;