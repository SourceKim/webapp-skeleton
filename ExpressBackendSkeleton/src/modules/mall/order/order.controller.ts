import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { orderPreviewSchema, createOrderSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { PaymentMethod, MallOrder, DeliveryStatus, OrderStatus } from './order.model';
import { HttpException } from '@/exceptions/http.exception';
import type { AppError } from '@/types/error';
import { AppDataSource } from '@/configs/database.config';

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

    /**
     * 管理员：获取订单列表（分页）
     * GET /api/v1/admin/orders
     */
    adminList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const repo = AppDataSource.getRepository(MallOrder);
            const { page, limit, sort_by, sort_order, filters } = req.pagination!;

            const qb = repo.createQueryBuilder('o')
                .leftJoin('o.user', 'u')
                .leftJoinAndSelect('o.items', 'items')
                .addSelect(['u.id', 'u.username', 'u.email', 'u.phone', 'u.avatar'])
                .where('o.deleted_at IS NULL');

            if (filters?.id) qb.andWhere('o.id = :id', { id: String(filters.id) });
            if (filters?.user_id) qb.andWhere('u.id = :uid', { uid: String(filters.user_id) });
            if (filters?.order_status) qb.andWhere('o.order_status = :os', { os: String(filters.order_status) });
            if (filters?.payment_status) qb.andWhere('o.payment_status = :ps', { ps: String(filters.payment_status) });
            if (filters?.delivery_status) qb.andWhere('o.delivery_status = :ds', { ds: String(filters.delivery_status) });

            qb.orderBy(`o.${sort_by}`, sort_order as 'ASC' | 'DESC')
                .skip((page - 1) * limit)
                .take(limit);

            const [items, total] = await qb.getManyAndCount();
            res.pagination!(items, total);
        } catch (e: unknown) {
            next(e);
        }
    };

    /**
     * 管理员：获取订单详情
     * GET /api/v1/admin/orders/:id
     */
    adminDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const repo = AppDataSource.getRepository(MallOrder);
            const order = await repo.findOne({
                where: { id: req.params.id },
                relations: ['user', 'items']
            });
            if (!order) {
                throw new HttpException(404, 'Order not found');
            }
            
            if (order.user) {
                const { password, ...u } = order.user;
                // 创建一个不包含 password 的用户对象
                order.user = { ...u } as typeof order.user;
            }
            
            res.json({ code: 0, message: 'OK', data: order });
        } catch (e: unknown) {
            next(e);
        }
    };

    /**
     * 管理员：发货
     * PUT /api/v1/admin/orders/:id/delivery
     */
    adminDelivery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const repo = AppDataSource.getRepository(MallOrder);
            const order = await repo.findOne({ where: { id: req.params.id } });
            if (!order) {
                throw new HttpException(404, 'Order not found');
            }

            order.delivery_status = DeliveryStatus.SHIPPED;
            order.delivery_time = new Date();
            // 同步更新主状态为已发货
            if (order.order_status === OrderStatus.TO_BE_SHIPPED || order.order_status === OrderStatus.UNPAID) {
                order.order_status = OrderStatus.SHIPPED;
            }
            
            await repo.save(order);
            res.json({ code: 0, message: '已发货', data: order });
        } catch (e: unknown) {
            next(e);
        }
    };

    /**
     * 管理员：更新订单状态
     * PUT /api/v1/admin/orders/:id/status
     */
    adminUpdateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const repo = AppDataSource.getRepository(MallOrder);
            const order = await repo.findOne({ where: { id: req.params.id } });
            if (!order) {
                throw new HttpException(404, 'Order not found');
            }

            const { status } = req.body;
            if (status && Object.values(OrderStatus).includes(status)) {
                order.order_status = status;
                if (status === OrderStatus.COMPLETED) {
                    order.delivery_status = DeliveryStatus.DELIVERED;
                    order.received_time = new Date();
                }
            }
            await repo.save(order);
            res.json({ code: 0, message: '状态更新成功', data: order });
        } catch (e: unknown) {
            next(e);
        }
    };
}
