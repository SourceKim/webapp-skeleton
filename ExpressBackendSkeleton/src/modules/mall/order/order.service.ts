import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { nanoid } from 'nanoid';
import { Order, OrderStatus } from './order.model';
import { OrderItem } from './order-item.model';
import { plainToInstance } from 'class-transformer';
import { OrderDTO, CreateOrderDto } from './order.dto';
import { Cart } from '@/modules/mall/cart/cart.model';
import { CartItem } from '@/modules/mall/cart/cart-item.model';
import { Product } from '@/modules/mall/product/product.model';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto } from '@/modules/common/common.dto';

export class OrderService {
  private orderRepository: Repository<Order>;
  private orderItemRepository: Repository<OrderItem>;
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private productRepository: Repository<Product>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.orderRepository = dataSource.getRepository(Order);
    this.orderItemRepository = dataSource.getRepository(OrderItem);
    this.cartRepository = dataSource.getRepository(Cart);
    this.cartItemRepository = dataSource.getRepository(CartItem);
    this.productRepository = dataSource.getRepository(Product);
  }

  private async calcOrderTotal(orderId: string): Promise<number> {
    const items = await this.orderItemRepository.find({ where: { order_id: orderId } });
    return items.reduce((sum, it) => sum + Number(it.unit_price) * it.quantity, 0);
  }

  async createFromCart(userId: string, dto: CreateOrderDto): Promise<OrderDTO> {
    const cart = await this.cartRepository.findOne({ where: { user_id: userId }, relations: { items: { product: true } } });
    if (!cart || !cart.items || cart.items.length === 0) throw new HttpException(400, '购物车为空');

    for (const it of cart.items) {
      const product = await this.productRepository.findOne({ where: { id: it.product_id } });
      if (!product) throw new HttpException(404, '商品不存在');
      if (product.stock < it.quantity) throw new HttpException(400, '库存不足');
    }

    const order = this.orderRepository.create({
      id: nanoid(16),
      user_id: userId,
      status: OrderStatus.PENDING,
      address: dto.address,
      remark: dto.remark,
      total_price: 0
    });
    await this.orderRepository.save(order);

    for (const it of cart.items) {
      const item = this.orderItemRepository.create({
        id: nanoid(16),
        order_id: order.id,
        product_id: it.product_id,
        quantity: it.quantity,
        unit_price: Number(it.product?.price || 0)
      });
      await this.orderItemRepository.save(item);
    }

    order.total_price = await this.calcOrderTotal(order.id);
    await this.orderRepository.save(order);

    // 不在创建时扣减库存，等发货时扣减。若需下单即锁定库存，可在此处理锁定逻辑。

    // 清空购物车
    await this.cartItemRepository.delete({ cart_id: cart.id });

    const created = await this.orderRepository.findOne({ where: { id: order.id }, relations: { items: { product: true } } });
    return plainToInstance(OrderDTO, created);
  }

  async getMyOrders(userId: string, query: PaginationQueryDto): Promise<{ items: OrderDTO[]; total: number }> {
    const qb = this.orderRepository.createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'oi')
      .leftJoinAndSelect('oi.product', 'p')
      .leftJoinAndSelect('p.materials', 'pm')
      .where('o.user_id = :uid', { uid: userId });

    if (query.filters && query.filters.status) {
      qb.andWhere('o.status = :status', { status: query.filters.status });
    }

    qb.orderBy(`o.${query.sort_by || 'created_at'}`, query.sort_order || 'DESC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const items = await qb.getMany();
    const dtos = items.map(i => plainToInstance(OrderDTO, i));
    return { items: dtos, total };
  }

  async getMyOrderDetail(userId: string, id: string): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findOne({ where: { id, user_id: userId }, relations: { items: { product: { materials: true } } } });
    if (!order) return null;
    const dto = plainToInstance(OrderDTO, order);
    return dto;
  }

  async confirm(userId: string, id: string): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findOne({ where: { id, user_id: userId } });
    if (!order) return null;
    if (order.status !== OrderStatus.PENDING) throw new HttpException(400, '当前状态不可确认');
    order.status = OrderStatus.CONFIRMED;
    order.paid_at = new Date();
    await this.orderRepository.save(order);
    const full = await this.orderRepository.findOne({ where: { id }, relations: { items: { product: { materials: true } } } });
    const dto = plainToInstance(OrderDTO, full);
    return dto;
  }

  async cancel(userId: string, id: string): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findOne({ where: { id, user_id: userId } });
    if (!order) return null;
    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.COMPLETED) {
      throw new HttpException(400, '已发货或已完成，不能取消');
    }
    order.status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);
    const full = await this.orderRepository.findOne({ where: { id }, relations: { items: { product: { materials: true } } } });
    const dto = plainToInstance(OrderDTO, full);
    return dto;
  }

  async ship(adminUserId: string, id: string, shippingNo: string): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) return null;
    if (order.status !== OrderStatus.CONFIRMED) throw new HttpException(400, '未确认不可发货');

    // 扣减库存
    const items = await this.orderItemRepository.find({ where: { order_id: id } });
    for (const it of items) {
      const product = await this.productRepository.findOne({ where: { id: it.product_id } });
      if (!product) continue;
      if (product.stock < it.quantity) throw new HttpException(400, '库存不足，无法发货');
      product.stock -= it.quantity;
      await this.productRepository.save(product);
    }

    order.status = OrderStatus.SHIPPED;
    order.shipped_at = new Date();
    order.shipping_no = shippingNo;
    await this.orderRepository.save(order);
    const full = await this.orderRepository.findOne({ where: { id }, relations: { items: { product: { materials: true } } } });
    const dto = plainToInstance(OrderDTO, full);
    return dto;
  }

  async complete(userId: string, id: string): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findOne({ where: { id, user_id: userId } });
    if (!order) return null;
    if (order.status !== OrderStatus.SHIPPED) throw new HttpException(400, '未发货不可完成');
    order.status = OrderStatus.COMPLETED;
    order.completed_at = new Date();
    await this.orderRepository.save(order);
    const full = await this.orderRepository.findOne({ where: { id }, relations: { items: { product: { materials: true } } } });
    const dto = plainToInstance(OrderDTO, full);
    return dto;
  }

  // Admin
  async adminPaginate(query: PaginationQueryDto): Promise<{ items: OrderDTO[]; total: number }> {
    const qb = this.orderRepository.createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'oi')
      .leftJoinAndSelect('oi.product', 'p')
      .leftJoinAndSelect('p.materials', 'pm');

    if (query.filters && query.filters.user_id) {
      qb.andWhere('o.user_id = :uid', { uid: query.filters.user_id });
    }
    if (query.filters && query.filters.status) {
      qb.andWhere('o.status = :status', { status: query.filters.status });
    }

    qb.orderBy(`o.${query.sort_by || 'created_at'}`, query.sort_order || 'DESC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const items = await qb.getMany();
    const dtos = items.map(i => plainToInstance(OrderDTO, i));
    return { items: dtos, total };
  }
}


