import { Router } from 'express';
import { CartController } from './cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new CartController();

// 用户购物车
router.use('/user/cart', authMiddleware);
router.get('/user/cart', (req, res, next) => controller.getMyCart(req, res, next));
router.post('/user/cart/items', (req, res, next) => controller.addItem(req, res, next));
router.put('/user/cart/items/:id', (req, res, next) => controller.updateItem(req, res, next));
// 别名：更新数量（语义化）
router.patch('/user/cart/items/:id/quantity', (req, res, next) => controller.updateItem(req, res, next));
router.delete('/user/cart/items/:id', (req, res, next) => controller.removeItem(req, res, next));
router.post('/user/cart/clear', (req, res, next) => controller.clear(req, res, next));

// 管理端购物车
router.use('/admin', authMiddleware, adminMiddleware);
router.get('/admin/carts', paginationQuery(), paginationResponse, (req, res, next) => controller.adminList(req, res, next));

export default router;


