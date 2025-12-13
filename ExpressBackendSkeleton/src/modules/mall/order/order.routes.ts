import { Router } from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const orderController = new OrderController();

// 普通用户 API - 需要认证
router.use(authMiddleware);

router.post('/preview', orderController.preview); // 预览订单
router.post('/', orderController.create); // 创建订单
router.get('/', orderController.list); // 获取订单列表
router.get('/:id', orderController.detail); // 获取订单详情
router.put('/:id/cancel', orderController.cancel); // 取消订单
router.put('/:id/pay', orderController.pay); // 支付订单
router.put('/:id/receive', orderController.receive); // 确认收货

export default router;
