import { Router } from 'express';
import { ENV } from '@/configs/env.config';
import authRoutes from '@/modules/auth/auth.routes';
import permissionRoutes from '@/modules/permission/permission.routes';
import roleRoutes from '@/modules/role/role.routes';
import userRoutes from '@/modules/user/user.routes';
import materialRoutes from '@/modules/material/material.routes';
// mall 模块已移除
import productBrandRoutes from '@/modules/product/brand/product-brand.routes';
import productCategoryRoutes from '@/modules/product/category/product-category.routes';
import productSpuRoutes from '@/modules/product/spu/product-spu.routes';
import productSkuRoutes from '@/modules/product/sku/product-sku.routes';
import productAttributeRoutes from '@/modules/product/attribute/product-attribute.routes';
import userAddressRoutes from '@/modules/user/address/user-address.routes';
import cartRoutes from '@/modules/mall/cart/cart.routes';
import cartAdminRoutes from '@/modules/mall/cart/cart.admin.routes';
import orderRoutes from '@/modules/mall/order/order.routes';
import orderAdminRoutes from '@/modules/mall/order/order.admin.routes';
import carouselRoutes from '@/modules/mall/carousel/carousel.routes';
import shopIntroRoutes from '@/modules/mall/shop-intro/shop-intro.routes';

const router = Router();

// API 版本控制（从环境变量读取，默认 /api/v1）
const API_VERSION = ENV.API_VERSION;

// 注册所有路由
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/permissions`, permissionRoutes);
router.use(`${API_VERSION}/roles`, roleRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/addresses`, userAddressRoutes);
router.use(`${API_VERSION}/cart`, cartRoutes);
router.use(`${API_VERSION}`, cartAdminRoutes);
router.use(`${API_VERSION}/orders`, orderRoutes);
router.use(`${API_VERSION}`, orderAdminRoutes);

// 首页模块
router.use(`${API_VERSION}/mall`, carouselRoutes);
router.use(`${API_VERSION}/mall`, shopIntroRoutes);

// 素材管理路由
router.use(`${API_VERSION}/materials`, materialRoutes);

// 商品管理（品牌等）
router.use(`${API_VERSION}/products`, productBrandRoutes);
router.use(`${API_VERSION}/products`, productCategoryRoutes);
router.use(`${API_VERSION}/products`, productSpuRoutes);
router.use(`${API_VERSION}/products`, productSkuRoutes);
router.use(`${API_VERSION}/products`, productAttributeRoutes);


export default router; 