import { Router } from 'express';
import { CarouselController } from './carousel.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '../../../constants/role.constants';
import { paginationQuery } from '../../../middlewares/paginationQuery';
import { paginationResponse } from '../../../middlewares/paginationResponse';

const router = Router();
const controller = new CarouselController();

// Public routes
router.get(
    '/carousels',
    paginationQuery(),
    paginationResponse,
    controller.getCarousels
);

router.get(
    '/carousels/:id',
    controller.getCarousel
);

// Admin routes
router.post(
    '/admin/carousels',
    authMiddleware,
    roleMiddleware(ADMIN_ROLE_NAMES),
    controller.createCarousel
);

router.put(
    '/admin/carousels/:id',
    authMiddleware,
    roleMiddleware(ADMIN_ROLE_NAMES),
    controller.updateCarousel
);

router.delete(
    '/admin/carousels/:id',
    authMiddleware,
    roleMiddleware(ADMIN_ROLE_NAMES),
    controller.deleteCarousel
);

export default router;

