import { Router } from 'express';
import { ShopIntroController } from './shop-intro.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { adminMiddleware } from '../../../middlewares/admin.middleware';

const router = Router();
const controller = new ShopIntroController();

// Public routes
router.get(
    '/shop-intro',
    controller.getShopIntro
);

// Admin routes
router.put(
    '/admin/shop-intro',
    authMiddleware,
    adminMiddleware,
    controller.updateShopIntro
);

export default router;

