import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { AppDataSource } from '@/configs/database.config';
import { Cart } from './cart.model';

const router = Router();

// 管理端购物车列表（分页）
router.use(authMiddleware, adminMiddleware);

router.get('/admin/carts', paginationQuery(), paginationResponse, async (req, res) => {
  const repo = AppDataSource.getRepository(Cart);
  const { page, limit, sort_by, sort_order, filters } = req.pagination;

  const qb = repo.createQueryBuilder('c')
    .leftJoinAndSelect('c.sku', 'sku')
    .leftJoin('c.user', 'u')
    .addSelect(['u.id', 'u.username', 'u.email'])
    .where('c.deleted_at IS NULL');

  if (filters?.user_id) qb.andWhere('u.id = :uid', { uid: String(filters.user_id) });
  if (filters?.sku_id) qb.andWhere('sku.id = :sid', { sid: String(filters.sku_id) });
  if (filters?.selected !== undefined) qb.andWhere('c.selected = :sel', { sel: String(filters.selected) === 'true' });

  qb.orderBy(`c.${sort_by}`, sort_order as 'ASC' | 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const [items, total] = await qb.getManyAndCount();
  res.pagination(items, total);
});

export default router;


