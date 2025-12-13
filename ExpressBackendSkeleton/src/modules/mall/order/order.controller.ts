import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { orderPreviewSchema, createOrderSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { PaymentMethod } from './order.model';
import { HttpException } from '@/exceptions/http.exception';
import type { AppError } from '@/types/error';

/**
 * 订单控制器
 * 处理订单相关的请求
 */
export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    /**
     * 预览订单
     * POST /api/v1/mall/order/preview
     */
    preview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = validateData(orderPreviewSchema, req.body);
            const data = await this.orderService.preview(req.user!.id, dto.cart_item_ids);
            res.json({ code: 0, message: 'OK', data });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '预览失败' });
        }
    };

    /**
     * 创建订单
     * POST /api/v1/mall/order
     */
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = validateData(createOrderSchema, req.body);
            const paymentMethod = 'payment_method' in dto ? (dto as { payment_method?: string }).payment_method : undefined;
            const order = await this.orderService.create(
                req.user!.id, 
                dto.cart_item_ids, 
                dto.address_id, 
                dto.remark, 
                paymentMethod as PaymentMethod | undefined
            );
            res.json({ code: 0, message: 'OK', data: order });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '创建失败' });
        }
    };

    /**
     * 获取订单列表
     * GET /api/v1/mall/order
     */
    list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.orderService.list(req.user!.id);
            res.json({ code: 0, message: 'OK', data });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            res.status(error.status || 500).json({ code: error.status || 500, message: error.message || '获取订单失败' });
        }
    };

    /**
     * 获取订单详情
     * GET /api/v1/mall/order/:id
     */
    detail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.orderService.detail(req.user!.id, req.params.id);
            res.json({ code: 0, message: 'OK', data });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '获取详情失败' });
        }
    };

    /**
     * 取消订单
     * PUT /api/v1/mall/order/:id/cancel
     */
    cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.orderService.cancel(req.user!.id, req.params.id);
            res.json({ code: 0, message: 'OK', data });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '取消失败' });
        }
    };

    /**
     * 支付订单
     * PUT /api/v1/mall/order/:id/pay
     */
    pay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { payment_method } = req.body as { payment_method?: string };
            const data = await this.orderService.pay(req.user!.id, req.params.id, payment_method as PaymentMethod | undefined);
            res.json({ code: 0, message: 'OK', data });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '支付失败' });
        }
    };

    /**
     * 确认收货
     * PUT /api/v1/mall/order/:id/receive
     */
    receive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.orderService.receive(req.user!.id, req.params.id);
            res.json({ code: 0, message: 'OK', data });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '确认收货失败' });
        }
    };
}
