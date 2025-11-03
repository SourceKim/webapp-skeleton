import { Request, Response, Router } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto, UpdateSelectedDto } from './cart.dto';
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
        const dto = (await (req as any).validate(CreateCartDto, 'body')) as CreateCartDto;
        const userId = req.user!.id;
        const item = await service.addItem(userId, dto.sku_id, dto.quantity);
        res.json({ code: 0, message: 'OK', data: item });
    } catch (e: any) {
        const status = e?.status || 500;
        res.status(status).json({ code: status, message: e?.message || '添加失败' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const dto = (await (req as any).validate(UpdateCartDto, 'body')) as UpdateCartDto;
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

router.put('/selected', async (req: Request, res: Response) => {
    try {
        const dto = (await (req as any).validate(UpdateSelectedDto, 'body')) as UpdateSelectedDto;
        const userId = req.user!.id;
        await service.updateSelected(userId, dto.selected, dto.cart_item_ids);
        res.json({ code: 0, message: 'OK' });
    } catch (e: any) {
        const status = e?.status || 500;
        res.status(status).json({ code: status, message: e?.message || '批量更新失败' });
    }
});

export default router;


