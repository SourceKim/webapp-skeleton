import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { nanoid } from 'nanoid';
import { Cart } from './cart.model';
import { CartItem } from './cart-item.model';
import { AddCartItemDto, CartDTO, CartItemDTO, UpdateCartItemDto } from './cart.dto';
import { Product } from '@/modules/mall/product/product.model';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { HttpException } from '@/exceptions/http.exception';

export class CartService {
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private productRepository: Repository<Product>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.cartRepository = dataSource.getRepository(Cart);
    this.cartItemRepository = dataSource.getRepository(CartItem);
    this.productRepository = dataSource.getRepository(Product);
  }

  private async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { user_id: userId }, relations: { items: { product: true } } });
    if (!cart) {
      cart = this.cartRepository.create({ id: nanoid(16), user_id: userId, total_price: 0 });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  private calcTotal(cart: Cart): number {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((sum, it) => sum + (Number(it.product?.price || 0) * it.quantity), 0);
  }

  async getUserCart(userId: string): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    const full = await this.cartRepository.findOne({ where: { id: cart.id }, relations: { items: { product: true } } });
    const total = this.calcTotal(full!);
    if (full) {
      full.total_price = total;
      await this.cartRepository.save(full);
    }
    return plainToInstance(CartDTO, full);
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new HttpException(404, '商品不存在');

    let item = await this.cartItemRepository.findOne({ where: { cart_id: cart.id, product_id: dto.product_id }, relations: { product: true } });
    if (!item) {
      item = this.cartItemRepository.create({ id: nanoid(16), cart_id: cart.id, product_id: dto.product_id, quantity: dto.quantity });
    } else {
      item.quantity += dto.quantity;
    }
    await this.cartItemRepository.save(item);

    const full = await this.cartRepository.findOne({ where: { id: cart.id }, relations: { items: { product: true } } });
    full!.total_price = this.calcTotal(full!);
    await this.cartRepository.save(full!);
    return plainToInstance(CartDTO, full);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<CartDTO | null> {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.cartItemRepository.findOne({ where: { id: itemId, cart_id: cart.id }, relations: { product: true } });
    if (!item) return null;
    item.quantity = dto.quantity;
    await this.cartItemRepository.save(item);
    const full = await this.cartRepository.findOne({ where: { id: cart.id }, relations: { items: { product: true } } });
    full!.total_price = this.calcTotal(full!);
    await this.cartRepository.save(full!);
    return plainToInstance(CartDTO, full);
  }

  async removeItem(userId: string, itemId: string): Promise<CartDTO | null> {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.cartItemRepository.findOne({ where: { id: itemId, cart_id: cart.id } });
    if (!item) return null;
    await this.cartItemRepository.remove(item);
    const full = await this.cartRepository.findOne({ where: { id: cart.id }, relations: { items: { product: true } } });
    full!.total_price = this.calcTotal(full!);
    await this.cartRepository.save(full!);
    return plainToInstance(CartDTO, full);
  }

  async clear(userId: string): Promise<CartDTO> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cart_id: cart.id });
    cart.total_price = 0;
    const full = await this.cartRepository.findOne({ where: { id: cart.id }, relations: { items: { product: true } } });
    return plainToInstance(CartDTO, full);
  }

  async adminPaginate(query: PaginationQueryDto): Promise<{ items: CartDTO[]; total: number }> {
    const qb = this.cartRepository.createQueryBuilder('c')
      .leftJoinAndSelect('c.items', 'ci')
      .leftJoinAndSelect('ci.product', 'p');

    if (query.filters && query.filters.user_id) {
      qb.andWhere('c.user_id = :uid', { uid: query.filters.user_id });
    }

    qb.orderBy(`c.${query.sort_by || 'created_at'}`, query.sort_order || 'DESC');
    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const items = await qb.getMany();
    return { items: items.map(i => plainToInstance(CartDTO, i)), total };
  }
}


