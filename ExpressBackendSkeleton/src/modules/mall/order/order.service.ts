import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { MallOrder, MallOrderItem, OrderStatus, PaymentStatus, DeliveryStatus } from './order.model';
import { Cart } from '@/modules/mall/cart/cart.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { UserAddress } from '@/modules/user/address/user-address.model';
import { nanoid } from 'nanoid';
import { HttpException } from '@/exceptions/HttpException';

export class OrderService {
  private orderRepo: Repository<MallOrder> = AppDataSource.getRepository(MallOrder)
  private itemRepo: Repository<MallOrderItem> = AppDataSource.getRepository(MallOrderItem)
  private cartRepo: Repository<Cart> = AppDataSource.getRepository(Cart)
  private skuRepo: Repository<ProductSku> = AppDataSource.getRepository(ProductSku)
  private addrRepo: Repository<UserAddress> = AppDataSource.getRepository(UserAddress)

  async preview(userId: string, cartItemIds: string[]) {
    const carts = await this.cartRepo.find({
      where: { user: { id: userId } as any },
      relations: ['sku', 'sku.spu', 'sku.spu.main_material', 'sku.sku_attributes', 'sku.sku_attributes.attribute_key', 'sku.sku_attributes.attribute_value']
    })
    const items = carts.filter(c => cartItemIds.includes(c.id)).map(c => {
      const unit = Number((c as any).sku?.price || 0)
      return {
        cart_id: c.id,
        sku_id: (c as any).sku?.id,
        spu: { id: (c as any).sku?.spu?.id, name: (c as any).sku?.spu?.name, sub_title: (c as any).sku?.spu?.sub_title || null, main_material: (c as any).sku?.spu?.main_material ? { file_path: (c as any).sku?.spu?.main_material?.file_path } : null },
        sku: {
          id: (c as any).sku?.id,
          price: unit,
          attributes: ((c as any).sku?.sku_attributes || []).map((a: any) => ({ key_id: a?.attribute_key?.id, key_name: a?.attribute_key?.name, value_id: a?.attribute_value?.value_id || a?.attribute_value?.id, value: a?.attribute_value?.value }))
        },
        quantity: c.quantity,
        total_price: unit * Number(c.quantity || 0)
      }
    })
    const totalAmount = items.reduce((s, it) => s + Number(it.total_price), 0)
    return { items, total_amount: totalAmount, discount_amount: 0, shipping_amount: 0, payable_amount: totalAmount }
  }

  async create(userId: string, cartItemIds: string[], addressId: string, remark?: string, payment_method?: any) {
    if (!cartItemIds?.length) throw new HttpException(400, 'cart_item_ids 不能为空')
    const addr = await this.addrRepo.findOne({ where: { id: addressId, user: { id: userId } as any } })
    if (!addr) throw new HttpException(400, '地址不存在')
    const preview = await this.preview(userId, cartItemIds)

    const order = this.orderRepo.create({
      id: nanoid(16),
      user: { id: userId } as any,
      total_amount: String(preview.total_amount.toFixed(2)),
      discount_amount: '0',
      shipping_amount: '0',
      payable_amount: String(preview.payable_amount.toFixed(2)),
      order_status: OrderStatus.PENDING,
      payment_status: PaymentStatus.UNPAID,
      delivery_status: DeliveryStatus.PENDING,
      payment_method: payment_method || null,
      address_id: addr.id,
      address_snapshot: {
        name: addr.name,
        phone: addr.phone,
        province: addr.province,
        city: addr.city,
        country: addr.country,
        town: addr.town,
        detail: addr.detail,
        postal_code: addr.postal_code
      },
      remark: remark || null
    })
    await this.orderRepo.save(order)

    for (const it of preview.items) {
      const item = this.itemRepo.create({
        id: nanoid(16),
        order: { id: order.id } as any,
        sku_id: it.sku_id,
        sku_snapshot: { ...it.sku, spu: it.spu },
        quantity: it.quantity,
        unit_price: String(Number(it.sku.price).toFixed(2)),
        total_price: String(Number(it.total_price).toFixed(2))
      })
      await this.itemRepo.save(item)
    }

    // 清理购物车
    await this.cartRepo.createQueryBuilder().delete().from(Cart).where('id IN (:...ids)', { ids: cartItemIds }).andWhere('user_id = :uid', { uid: userId }).execute()
    return order
  }

  async list(userId: string) {
    return this.orderRepo.find({
      where: { user: { id: userId } as any },
      order: { created_at: 'DESC' } as any,
      relations: ['items']
    })
  }

  async detail(userId: string, id: string) {
    const order = await this.orderRepo.findOne({ where: { id, user: { id: userId } as any } })
    if (!order) throw new HttpException(404, '订单不存在')
    const items = await this.itemRepo.find({ where: { order: { id } as any } })
    return { order, items }
  }

  async cancel(userId: string, id: string) {
    const order = await this.orderRepo.findOne({ where: { id, user: { id: userId } as any } })
    if (!order) throw new HttpException(404, '订单不存在')
    order.order_status = OrderStatus.CANCELED
    await this.orderRepo.save(order)
    return order
  }
}


