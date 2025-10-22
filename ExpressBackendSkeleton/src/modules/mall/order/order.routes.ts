import { Router } from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new OrderController();

// 用户侧
router.use('/user/orders', authMiddleware);
router.post('/user/orders', (req, res, next) => controller.createFromCart(req, res, next));
router.get('/user/orders', paginationQuery(), paginationResponse, (req, res, next) => controller.myOrders(req, res, next));
router.get('/user/orders/:id', (req, res, next) => controller.myOrderDetail(req, res, next));
router.post('/user/orders/:id/confirm', (req, res, next) => controller.confirm(req, res, next));
router.post('/user/orders/:id/cancel', (req, res, next) => controller.cancel(req, res, next));
router.post('/user/orders/:id/complete', (req, res, next) => controller.complete(req, res, next));

// 管理侧
router.use('/admin', authMiddleware, adminMiddleware);
router.get('/admin/orders', paginationQuery(), paginationResponse, (req, res, next) => controller.adminList(req, res, next));
router.post('/admin/orders/:id/ship', (req, res, next) => controller.ship(req, res, next));

export default router;


