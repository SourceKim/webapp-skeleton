import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { ADMIN_ROLE_NAMES } from '@/constants/role.constants';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { AppDataSource } from '@/configs/database.config';
import { MallOrder, DeliveryStatus, OrderStatus } from './order.model';
import { HttpException } from '@/exceptions/http.exception';

const router = Router();

// 移除全局 use，防止污染挂载路径下的其他路由
// router.use(authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES));

router.get('/admin/orders', authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), paginationQuery(), paginationResponse, async (req, res) => {
  const repo = AppDataSource.getRepository(MallOrder);
  const { page, limit, sort_by, sort_order, filters } = req.pagination;

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
  res.pagination(items, total);
});

router.get('/admin/orders/:id', authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), async (req, res) => {
  const repo = AppDataSource.getRepository(MallOrder);
  const order = await repo.findOne({
    where: { id: req.params.id },
    relations: ['user', 'items']
  });
  if (!order) throw new HttpException(404, 'Order not found');
  
  if (order.user) {
      const { password, ...u } = order.user;
      // 创建一个不包含 password 的用户对象
      order.user = { ...u } as typeof order.user;
  }
  
  res.json({ code: 0, message: 'OK', data: order });
});

// 发货
router.put('/admin/orders/:id/delivery', authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), async (req, res) => {
  const repo = AppDataSource.getRepository(MallOrder);
  const order = await repo.findOne({ where: { id: req.params.id } });
  if (!order) throw new HttpException(404, 'Order not found');

  order.delivery_status = DeliveryStatus.SHIPPED;
  order.delivery_time = new Date();
  // 同步更新主状态为已发货
  if (order.order_status === OrderStatus.TO_BE_SHIPPED || order.order_status === OrderStatus.UNPAID) {
      order.order_status = OrderStatus.SHIPPED;
  }
  
  await repo.save(order);
  res.json({ code: 0, message: '已发货', data: order });
});

// 更新状态
router.put('/admin/orders/:id/status', authMiddleware, roleMiddleware(ADMIN_ROLE_NAMES), async (req, res) => {
    const repo = AppDataSource.getRepository(MallOrder);
    const order = await repo.findOne({ where: { id: req.params.id } });
    if (!order) throw new HttpException(404, 'Order not found');

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
});

export default router;


