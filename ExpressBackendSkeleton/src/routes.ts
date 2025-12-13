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
import { CartController } from '@/modules/mall/cart/cart.controller';
import orderRoutes from '@/modules/mall/order/order.routes';
import { OrderController } from '@/modules/mall/order/order.controller';
import carouselRoutes from '@/modules/mall/carousel/carousel.routes';
import shopIntroRoutes from '@/modules/mall/shop-intro/shop-intro.routes';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

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
router.use(`${API_VERSION}/orders`, orderRoutes);

// 管理员 API - 购物车和订单管理
const cartController = new CartController();
const orderController = new OrderController();

router.get(`${API_VERSION}/admin/carts`, authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), paginationQuery(), paginationResponse, cartController.adminList); // 管理员：获取购物车列表（分页）

router.get(`${API_VERSION}/admin/orders`, authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), paginationQuery(), paginationResponse, orderController.adminList); // 管理员：获取订单列表（分页）
router.get(`${API_VERSION}/admin/orders/:id`, authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), orderController.adminDetail); // 管理员：获取订单详情
router.put(`${API_VERSION}/admin/orders/:id/delivery`, authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), orderController.adminDelivery); // 管理员：发货
router.put(`${API_VERSION}/admin/orders/:id/status`, authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), orderController.adminUpdateStatus); // 管理员：更新订单状态

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