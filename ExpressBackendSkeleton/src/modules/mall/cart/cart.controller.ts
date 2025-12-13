import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { createCartSchema, updateCartSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { HttpException } from '@/exceptions/http.exception';
import type { UpdateSelectedRequestBody } from '@/types/common';
import { AppDataSource } from '@/configs/database.config';
import { Cart } from './cart.model';
import { asyncHandler } from '@/utils/async-handler';

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
    list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.id;
        const items = await this.cartService.listUserView(userId);
        res.json({ code: 0, message: 'OK', data: items });
    });

    /**
     * 添加商品到购物车
     * POST /api/v1/mall/cart
     */
    addItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const dto = validateData(createCartSchema, req.body);
        const userId = req.user!.id;
        const item = await this.cartService.addItem(userId, dto.sku_id, dto.quantity);
        res.json({ code: 0, message: 'OK', data: item });
    });

    /**
     * 批量更新选中状态
     * PUT /api/v1/mall/cart/selected
     */
    updateSelected = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        // 容错解析，避免前端类型/字段名差异导致 400
        const raw: UpdateSelectedRequestBody = req.body || {};
        const ids: string[] = Array.isArray(raw.cart_item_ids) ? raw.cart_item_ids
            : (Array.isArray(raw.ids) ? raw.ids : []);
        const selRaw = raw.selected;
        const selected = selRaw === true || selRaw === 'true' || selRaw === 1 || selRaw === '1';
        if (!ids || ids.length === 0) { 
            throw new HttpException(400, 'cart_item_ids 不能为空');
        }
        const userId = req.user!.id;
        await this.cartService.updateSelected(userId, selected, ids);
        res.json({ code: 0, message: 'OK' });
    });

    /**
     * 更新购物车商品数量
     * PUT /api/v1/mall/cart/:id
     */
    updateQuantity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const dto = validateData(updateCartSchema, req.body);
        const userId = req.user!.id;
        const id = req.params.id;
        if (!dto.quantity) { 
            throw new HttpException(400, 'quantity 必填');
        }
        const item = await this.cartService.updateQuantity(userId, id, dto.quantity);
        res.json({ code: 0, message: 'OK', data: item });
    });

    /**
     * 删除购物车商品
     * DELETE /api/v1/mall/cart/:id
     */
    remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.id;
        const id = req.params.id;
        await this.cartService.remove(userId, id);
        res.json({ code: 0, message: 'OK' });
    });

    /**
     * 管理员：获取购物车列表（分页）
     * GET /api/v1/admin/carts
     */
    adminList = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const repo = AppDataSource.getRepository(Cart);
        const { page, limit, sort_by, sort_order, filters } = req.pagination!;

        const qb = repo.createQueryBuilder('c')
            .leftJoinAndSelect('c.sku', 'sku')
            .leftJoinAndSelect('sku.spu', 'spu')
            .leftJoinAndSelect('spu.main_material', 'mm')
            .leftJoinAndSelect('sku.sku_attributes', 'attr')
            .leftJoinAndSelect('attr.attribute_key', 'attr_key')
            .leftJoinAndSelect('attr.attribute_value', 'attr_val')
            .leftJoin('c.user', 'u')
            .addSelect(['u.id', 'u.username', 'u.email', 'u.phone', 'u.avatar'])
            .where('c.deleted_at IS NULL');

        if (filters?.user_id) qb.andWhere('u.id = :uid', { uid: String(filters.user_id) });
        if (filters?.sku_id) qb.andWhere('sku.id = :sid', { sid: String(filters.sku_id) });
        if (filters?.selected !== undefined) qb.andWhere('c.selected = :sel', { sel: String(filters.selected) === 'true' });

        qb.orderBy(`c.${sort_by}`, sort_order as 'ASC' | 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [items, total] = await qb.getManyAndCount();
        res.pagination!(items, total);
    });
}
