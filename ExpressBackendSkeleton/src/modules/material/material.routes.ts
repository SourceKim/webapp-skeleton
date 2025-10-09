import { Router } from 'express';
import { MaterialController } from '@/modules/material/material.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import materialCategoryRoutes from '@/modules/material/mateial-category/material-category.routes';
import materialTagRoutes from './mateial-tag/material-tag.routes';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new MaterialController();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/admin/', paginationQuery(), paginationResponse, controller.getMaterials);
router.get('/admin/:id', controller.getMaterialById); // 获取单个素材

// 用户上传 API - 需要用户认证
router.post('/admin/upload', controller.uploadMaterial); // 用户上传素材

// 管理员 API - 需要管理员权限
router.post('/admin/upload', controller.uploadMaterial); // 管理员上传素材
router.put('/admin/:id', controller.updateMaterial); // 更新素材
router.delete('/admin/:id', controller.deleteMaterial); // 删除素材

// 管理员分类管理API
router.use('/categories', materialCategoryRoutes);

// 管理员标签管理API
router.use('/tags', materialTagRoutes);

export default router; 