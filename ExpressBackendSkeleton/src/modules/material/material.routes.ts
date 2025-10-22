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

// 所有素材接口需登录
router.use(authMiddleware);

// 普通用户上传（与控制器注释一致：POST /api/v1/materials/upload）
router.post('/upload', controller.uploadMaterial);

// 管理员接口
router.use('/admin', adminMiddleware);
router.post('/admin/upload', controller.uploadMaterial); // 兼容旧路径：管理员上传
router.get('/admin/', paginationQuery(), paginationResponse, controller.getMaterials);
router.get('/admin/:id', controller.getMaterialById); // 获取单个素材
router.put('/admin/:id', controller.updateMaterial); // 更新素材
router.delete('/admin/:id', controller.deleteMaterial); // 删除素材

// 管理员分类管理API
router.use('/categories', materialCategoryRoutes);

// 管理员标签管理API
router.use('/tags', materialTagRoutes);

export default router; 