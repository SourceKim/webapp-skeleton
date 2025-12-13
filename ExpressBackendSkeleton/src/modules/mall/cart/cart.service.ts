import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { Cart } from './cart.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';

export class CartService {
    private cartRepo: Repository<Cart>;
    private skuRepo: Repository<ProductSku>;

    constructor() {
        this.cartRepo = AppDataSource.getRepository(Cart);
        this.skuRepo = AppDataSource.getRepository(ProductSku);
    }

    async listByUser(userId: string): Promise<Cart[]> {
        return this.cartRepo.find({
            where: { user_id: userId },
            relations: ['sku'],
            order: { created_at: 'DESC' }
        });
    }

    /**
     * 用户端列表（轻量字段）：包含 SPU、SKU 关键字段与购物车主字段
     */
    async listUserView(userId: string): Promise<Array<{ id: string; quantity: number; selected: boolean; created_at: Date; updated_at: Date; sku: { id: string; sku_name?: string | null; price: number; original_price?: number | null; attributes?: Array<{ key_id?: string; key_name?: string; value_id?: string; value?: string }> }; spu: { id: string; name: string; sub_title?: string | null } }>> {
        const items = await this.cartRepo.find({
            where: { user_id: userId },
            relations: [
                'sku',
                'sku.spu',
                'sku.spu.main_material',
                'sku.sku_attributes',
                'sku.sku_attributes.attribute_key',
                'sku.sku_attributes.attribute_value',
            ],
            order: { created_at: 'DESC' }
        });

        return items.map((c) => ({
            id: c.id,
            quantity: Number(c.quantity || 0),
            selected: Boolean(c.selected),
            created_at: c.created_at,
            updated_at: c.updated_at,
            sku: {
                id: c.sku?.id || '',
                sku_name: c.sku?.sku_name ?? null,
                price: Number(c.sku?.price ?? 0),
                original_price: c.sku?.original_price != null ? Number(c.sku.original_price) : null,
                attributes: (c.sku?.sku_attributes || []).map(a => ({
                    key_id: a.attribute_key?.id,
                    key_name: a.attribute_key?.name,
                    value_id: a.attribute_value?.value_id || a.attribute_value?.id,
                    value: a.attribute_value?.value,
                }))
            },
            spu: {
                id: c.sku?.spu?.id || '',
                name: c.sku?.spu?.name || '',
                sub_title: c.sku?.spu?.sub_title ?? null,
                main_material: c.sku?.spu?.main_material ? {
                    file_path: c.sku.spu.main_material.file_path
                } : null
            }
        }));
    }

    async addItem(userId: string, skuId: string, quantity: number): Promise<Cart> {
        const sku = await this.skuRepo.findOne({ where: { id: skuId } });
        if (!sku) throw new HttpException(404, 'SKU 不存在');

        const existed = await this.cartRepo.findOne({ where: { user_id: userId, sku_id: skuId }, relations: ['sku'] });
        if (existed) {
            existed.quantity = Math.max(1, existed.quantity + quantity);
            return this.cartRepo.save(existed);
        }

        const entity = this.cartRepo.create({
            id: nanoid(16),
            user_id: userId,
            sku_id: skuId,
            quantity,
            selected: true
        });
        return this.cartRepo.save(entity);
    }

    async updateQuantity(userId: string, cartId: string, quantity: number): Promise<Cart> {
        const entity = await this.cartRepo.findOne({ where: { id: cartId, user_id: userId }, relations: ['sku'] });
        if (!entity) throw new HttpException(404, '购物车项不存在');

        if (quantity <= 0) {
            await this.cartRepo.remove(entity);
            throw new HttpException(200, '已删除该购物车项');
        }
        entity.quantity = quantity;
        return this.cartRepo.save(entity);
    }

    async remove(userId: string, cartId: string): Promise<void> {
        const entity = await this.cartRepo.findOne({ where: { id: cartId, user_id: userId } });
        if (!entity) return;
        await this.cartRepo.remove(entity);
    }

    async updateSelected(userId: string, selected: boolean, ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) return;
        await this.cartRepo.createQueryBuilder()
            .update(Cart)
            .set({ selected })
            .where('id IN (:...ids)', { ids })
            .andWhere('user_id = :userId', { userId })
            .execute();
    }
}


