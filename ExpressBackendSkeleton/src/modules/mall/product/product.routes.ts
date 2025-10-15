import { Router } from 'express';
import { ProductController } from './product.controller';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new ProductController();

// 管理端（需管理员） - 必须在 /:id 之前定义，避免路径被参数化路由拦截
router.use('/admin', authMiddleware, adminMiddleware);
router.get('/admin', paginationQuery(), paginationResponse, (req, res, next) => controller.getProducts(req, res, next));
router.get('/admin/:id', (req, res, next) => controller.getProductById(req, res, next));
router.post('/admin', (req, res, next) => controller.createProduct(req, res, next));
router.put('/admin/:id', (req, res, next) => controller.updateProduct(req, res, next));
router.delete('/admin/:id', (req, res, next) => controller.deleteProduct(req, res, next));

// 公共端（用户可匿名访问商品列表/详情）
router.get('/', paginationQuery(), paginationResponse, (req, res, next) => controller.getProducts(req, res, next));
router.get('/:id', (req, res, next) => controller.getProductById(req, res, next));

export default router;


