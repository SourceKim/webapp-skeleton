import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { createCartSchema, updateCartSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { HttpException } from '@/exceptions/http.exception';
import type { AppError } from '@/types/error';
import type { UpdateSelectedRequestBody } from '@/types/common';

/**
 * 购物车控制器
 * 处理购物车相关的请求
 */
export class CartController {
    private cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }

    /**
     * 获取购物车列表
     * GET /api/v1/mall/cart
     */
    list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const items = await this.cartService.listUserView(userId);
            res.json({ code: 0, message: 'OK', data: items });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            res.status(error.status || 500).json({ code: error.status || 500, message: error.message || '获取购物车失败' });
        }
    };

    /**
     * 添加商品到购物车
     * POST /api/v1/mall/cart
     */
    addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = validateData(createCartSchema, req.body);
            const userId = req.user!.id;
            const item = await this.cartService.addItem(userId, dto.sku_id, dto.quantity);
            res.json({ code: 0, message: 'OK', data: item });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '添加失败' });
        }
    };

    /**
     * 批量更新选中状态
     * PUT /api/v1/mall/cart/selected
     */
    updateSelected = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // 容错解析，避免前端类型/字段名差异导致 400
            const raw: UpdateSelectedRequestBody = req.body || {};
            const ids: string[] = Array.isArray(raw.cart_item_ids) ? raw.cart_item_ids
                : (Array.isArray(raw.ids) ? raw.ids : []);
            const selRaw = raw.selected;
            const selected = selRaw === true || selRaw === 'true' || selRaw === 1 || selRaw === '1';
            if (!ids || ids.length === 0) { 
                res.status(400).json({ code: 400, message: 'cart_item_ids 不能为空' }); 
                return; 
            }
            const userId = req.user!.id;
            await this.cartService.updateSelected(userId, selected, ids);
            res.json({ code: 0, message: 'OK' });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '批量更新失败' });
        }
    };

    /**
     * 更新购物车商品数量
     * PUT /api/v1/mall/cart/:id
     */
    updateQuantity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = validateData(updateCartSchema, req.body);
            const userId = req.user!.id;
            const id = req.params.id;
            if (!dto.quantity) { 
                res.status(400).json({ code: 400, message: 'quantity 必填' }); 
                return; 
            }
            const item = await this.cartService.updateQuantity(userId, id, dto.quantity);
            res.json({ code: 0, message: 'OK', data: item });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            const status = error.status || 500;
            res.status(status).json({ code: status, message: error.message || '更新失败' });
        }
    };

    /**
     * 删除购物车商品
     * DELETE /api/v1/mall/cart/:id
     */
    remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const id = req.params.id;
            await this.cartService.remove(userId, id);
            res.json({ code: 0, message: 'OK' });
        } catch (e: unknown) {
            const error: AppError = e instanceof HttpException 
                ? { status: e.status, message: e.message, name: e.name }
                : e instanceof Error
                ? { message: e.message, name: e.name, stack: e.stack }
                : { message: String(e), name: 'Error' };
            res.status(error.status || 500).json({ code: error.status || 500, message: error.message || '删除失败' });
        }
    };
}
