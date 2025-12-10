import { Router } from 'express';
import { ShopIntroController } from './shop-intro.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '../../../constants/role.constants';

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
    roleMiddleware(ADMIN_ROLE_NAMES),
    controller.updateShopIntro
);

export default router;

