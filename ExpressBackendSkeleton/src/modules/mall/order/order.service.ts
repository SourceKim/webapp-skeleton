import { Repository, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { MallOrder, MallOrderItem, OrderStatus, PaymentStatus, DeliveryStatus, OrderSkuSnapshot, OrderAddressSnapshot } from './order.model';
import { Cart } from '@/modules/mall/cart/cart.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { UserAddress } from '@/modules/user/address/user-address.model';
import { PaymentMethod } from './order.model';
import { nanoid } from 'nanoid';
import { HttpException } from '@/exceptions/http.exception';

export class OrderService {
  private orderRepo: Repository<MallOrder> = AppDataSource.getRepository(MallOrder)
  private itemRepo: Repository<MallOrderItem> = AppDataSource.getRepository(MallOrderItem)
  private cartRepo: Repository<Cart> = AppDataSource.getRepository(Cart)
  private skuRepo: Repository<ProductSku> = AppDataSource.getRepository(ProductSku)
  private addrRepo: Repository<UserAddress> = AppDataSource.getRepository(UserAddress)

  async preview(userId: string, cartItemIds: string[]) {
    const carts = await this.cartRepo.find({
      where: { user_id: userId },
      relations: ['sku', 'sku.spu', 'sku.spu.main_material', 'sku.sku_attributes', 'sku.sku_attributes.attribute_key', 'sku.sku_attributes.attribute_value']
    })
    const items = carts.filter(c => cartItemIds.includes(c.id)).map(c => {
      const unit = Number(c.sku?.price || 0)
      return {
        cart_id: c.id,
        sku_id: c.sku?.id || '',
        spu: { 
          id: c.sku?.spu?.id || '', 
          name: c.sku?.spu?.name || '', 
          sub_title: c.sku?.spu?.sub_title || null, 
          main_material: c.sku?.spu?.main_material ? { file_path: c.sku.spu.main_material.file_path || undefined } : null 
        },
        sku: {
          id: c.sku?.id || '',
          price: unit,
          attributes: (c.sku?.sku_attributes || []).map(a => ({ 
            key_id: a.attribute_key?.id || '', 
            key_name: a.attribute_key?.name || '', 
            value_id: a.attribute_value?.value_id || a.attribute_value?.id || '', 
            value: a.attribute_value?.value || '' 
          }))
        },
        quantity: c.quantity,
        total_price: unit * Number(c.quantity || 0)
      }
    })
    const totalAmount = items.reduce((s, it) => s + Number(it.total_price), 0)
    return { items, total_amount: totalAmount, discount_amount: 0, shipping_amount: 0, payable_amount: totalAmount }
  }

  async create(userId: string, cartItemIds: string[], addressId: string, remark?: string, payment_method?: PaymentMethod) {
    if (!cartItemIds?.length) throw new HttpException(400, 'cart_item_ids 不能为空')
    const addr = await this.addrRepo.findOne({ where: { id: addressId, user_id: userId } })
    if (!addr) throw new HttpException(400, '地址不存在')
    const preview = await this.preview(userId, cartItemIds)

    const addressSnapshot: OrderAddressSnapshot = {
      name: addr.name,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      country: addr.country,
      town: addr.town || null,
      detail: addr.detail,
      postal_code: addr.postal_code || null
    }

    const order = this.orderRepo.create({
      id: nanoid(16),
      user_id: userId,
      total_amount: String(preview.total_amount.toFixed(2)),
      discount_amount: '0',
      shipping_amount: '0',
      payable_amount: String(preview.payable_amount.toFixed(2)),
      order_status: OrderStatus.UNPAID,
      payment_status: PaymentStatus.UNPAID,
      delivery_status: DeliveryStatus.PENDING,
      payment_method: payment_method || null,
      address_id: addr.id,
      address_snapshot: addressSnapshot,
      remark: remark || null
    })
    await this.orderRepo.save(order)

    for (const it of preview.items) {
      const skuSnapshot: OrderSkuSnapshot = {
        id: it.sku.id,
        price: it.sku.price,
        attributes: it.sku.attributes,
        spu: it.spu
      }
      const item = this.itemRepo.create({
        id: nanoid(16),
        order_id: order.id,
        sku_id: it.sku_id,
        sku_snapshot: skuSnapshot,
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
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      relations: ['items']
    })
  }

  async detail(userId: string, id: string) {
    const order = await this.orderRepo.findOne({ where: { id, user_id: userId } })
    if (!order) throw new HttpException(404, '订单不存在')
    const items = await this.itemRepo.find({ where: { order_id: id } })
    return { order, items }
  }

  async pay(userId: string, id: string, paymentMethod?: PaymentMethod) {
    const order = await this.orderRepo.findOne({ where: { id, user_id: userId } })
    if (!order) throw new HttpException(404, '订单不存在')
    if (order.order_status !== OrderStatus.UNPAID) throw new HttpException(400, '订单状态不正确')
    
    order.payment_status = PaymentStatus.PAID
    order.payment_time = new Date()
    order.order_status = OrderStatus.TO_BE_SHIPPED
    if (paymentMethod) order.payment_method = paymentMethod
    
    await this.orderRepo.save(order)
    return order
  }

  async receive(userId: string, id: string) {
    const order = await this.orderRepo.findOne({ where: { id, user_id: userId } })
    if (!order) throw new HttpException(404, '订单不存在')
    if (order.order_status !== OrderStatus.SHIPPED) throw new HttpException(400, '订单未发货')

    order.order_status = OrderStatus.COMPLETED
    order.delivery_status = DeliveryStatus.DELIVERED
    order.received_time = new Date()
    await this.orderRepo.save(order)
    return order
  }

  async cancel(userId: string, id: string) {
    const order = await this.orderRepo.findOne({ where: { id, user_id: userId } })
    if (!order) throw new HttpException(404, '订单不存在')
    order.order_status = OrderStatus.CANCELED
    await this.orderRepo.save(order)
    return order
  }
}


