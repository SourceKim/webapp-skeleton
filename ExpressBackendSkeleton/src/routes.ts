import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import permissionRoutes from '@/modules/permission/permission.routes';
import roleRoutes from '@/modules/role/role.routes';
import userRoutes from '@/modules/user/user.routes';
import materialRoutes from '@/modules/material/material.routes';
// mall 模块已移除
import productBrandRoutes from '@/modules/product/brand/product-brand.routes';
import productCategoryRoutes from '@/modules/product/category/product-category.routes';
import productSpuRoutes from '@/modules/product/spu/product-spu.routes';

const router = Router();

// API 版本控制
const API_VERSION = '/api/v1';

// 注册所有路由
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/permissions`, permissionRoutes);
router.use(`${API_VERSION}/roles`, roleRoutes);
router.use(`${API_VERSION}/users`, userRoutes);

// 素材管理路由
router.use(`${API_VERSION}/materials`, materialRoutes);

// 商品管理（品牌等）
router.use(`${API_VERSION}/products`, productBrandRoutes);
router.use(`${API_VERSION}/products`, productCategoryRoutes);
router.use(`${API_VERSION}/products`, productSpuRoutes);


export default router; 