import { Request, Response, Router } from 'express';
import { CartService } from './cart.service';
import type { CreateCartDto, UpdateCartDto, UpdateSelectedDto } from '@skeleton/shared-types';
import { createCartSchema, updateCartSchema, updateSelectedSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const service = new CartService();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const items = await service.listUserView(userId);
        res.json({ code: 0, message: 'OK', data: items });
    } catch (e: any) {
        res.status(500).json({ code: 500, message: '获取购物车失败' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const dto = validateData(createCartSchema, req.body);
        const userId = req.user!.id;
        const item = await service.addItem(userId, dto.sku_id, dto.quantity);
        res.json({ code: 0, message: 'OK', data: item });
    } catch (e: any) {
        const status = e?.status || 500;
        res.status(status).json({ code: status, message: e?.message || '添加失败' });
    }
});

router.put('/selected', async (req: Request, res: Response) => {
    try {
        // 容错解析，避免前端类型/字段名差异导致 400
        const raw = (req.body || {}) as any;
        const ids: string[] = Array.isArray(raw.cart_item_ids) ? raw.cart_item_ids
            : (Array.isArray(raw.ids) ? raw.ids : []);
        const selRaw = raw.selected;
        const selected = selRaw === true || selRaw === 'true' || selRaw === 1 || selRaw === '1';
        if (!ids || ids.length === 0) { res.status(400).json({ code: 400, message: 'cart_item_ids 不能为空' }); return; }
        const userId = req.user!.id;
        await service.updateSelected(userId, selected, ids);
        res.json({ code: 0, message: 'OK' });
    } catch (e: any) {
        const status = e?.status || 500;
        res.status(status).json({ code: status, message: e?.message || '批量更新失败' });
    }
});

// 注意顺序：放在 /selected 之后，避免 /selected 被当成 :id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const dto = validateData(updateCartSchema, req.body);
        const userId = req.user!.id;
        const id = req.params.id;
        if (!dto.quantity) { res.status(400).json({ code: 400, message: 'quantity 必填' }); return; }
        const item = await service.updateQuantity(userId, id, dto.quantity);
        res.json({ code: 0, message: 'OK', data: item });
    } catch (e: any) {
        const status = e?.status || 500;
        res.status(status).json({ code: status, message: e?.message || '更新失败' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = req.params.id;
        await service.remove(userId, id);
        res.json({ code: 0, message: 'OK' });
    } catch (e: any) {
        res.status(500).json({ code: 500, message: '删除失败' });
    }
});

export default router;


