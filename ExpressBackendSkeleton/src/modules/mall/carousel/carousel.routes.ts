import { Router } from 'express';
import { CarouselController } from './carousel.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { adminMiddleware } from '../../../middlewares/admin.middleware';
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
    adminMiddleware,
    controller.createCarousel
);

router.put(
    '/admin/carousels/:id',
    authMiddleware,
    adminMiddleware,
    controller.updateCarousel
);

router.delete(
    '/admin/carousels/:id',
    authMiddleware,
    adminMiddleware,
    controller.deleteCarousel
);

export default router;

