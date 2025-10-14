// @ts-nocheck
/* eslint-disable */
import { Router } from 'express';
import { __PascalName__Controller } from '@/modules/__kebabName__/__kebabName__.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';

const router = Router();
const controller = new __PascalName__Controller();

router.use(authMiddleware, adminMiddleware);

router.get('/admin', paginationQuery(), paginationResponse, controller.findAll);
router.get('/admin/:id', controller.findById);
router.post('/admin', controller.create);
router.put('/admin/:id', controller.update);
router.delete('/admin/:id', controller.delete);

export default router;


