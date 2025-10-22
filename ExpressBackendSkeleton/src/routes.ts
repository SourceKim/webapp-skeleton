import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import permissionRoutes from '@/modules/permission/permission.routes';
import roleRoutes from '@/modules/role/role.routes';
import userRoutes from '@/modules/user/user.routes';
import userSettingsRoutes from '@/modules/user/user-settings.routes';
import materialRoutes from '@/modules/material/material.routes';
import productRoutes from '@/modules/mall/product/product.routes';
import cartRoutes from '@/modules/mall/cart/cart.routes';
import orderRoutes from '@/modules/mall/order/order.routes';

const router = Router();

// API 版本控制
const API_VERSION = '/api/v1';

// 注册所有路由
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/permissions`, permissionRoutes);
router.use(`${API_VERSION}/roles`, roleRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}`, userSettingsRoutes); // 用户设置路由

// 素材管理路由
router.use(`${API_VERSION}/materials`, materialRoutes);
router.use(`${API_VERSION}/products`, productRoutes);
router.use(`${API_VERSION}`, cartRoutes);
router.use(`${API_VERSION}`, orderRoutes);

export default router; 