import { Router } from 'express';
import { CartController } from './cart.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const cartController = new CartController();

router.use(authMiddleware);

router.get('/', cartController.list); // 获取购物车列表
router.post('/', cartController.addItem); // 添加商品到购物车
router.put('/selected', cartController.updateSelected); // 批量更新选中状态
// 注意顺序：放在 /selected 之后，避免 /selected 被当成 :id
router.put('/:id', cartController.updateQuantity); // 更新购物车商品数量
router.delete('/:id', cartController.remove); // 删除购物车商品

export default router;
