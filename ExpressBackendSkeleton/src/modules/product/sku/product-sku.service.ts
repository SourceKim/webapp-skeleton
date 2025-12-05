import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductSku, ProductSkuStatus } from './product-sku.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductSkuDto, ProductSkuDTO, UpdateProductSkuDto } from './product-sku.dto';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class ProductSkuService {
    private repository: Repository<ProductSku>;
    constructor() {
        this.repository = AppDataSource.getRepository(ProductSku);
    }

    async findAll(query: PaginationQueryDto): Promise<{ items: ProductSkuDTO[]; total: number }> {
        const qb = this.repository.createQueryBuilder('sku')
            .leftJoinAndSelect('sku.sku_attributes', 'sa')
            .leftJoinAndSelect('sa.attribute_key', 'ak')
            .leftJoinAndSelect('sa.attribute_value', 'av');

        if (query.filters) {
            const conditions = QueryFilterBuilder.parseFilters(query.filters, 'sku');
            QueryFilterBuilder.applyFilters(qb, conditions);
        }

        qb.orderBy(`sku.${query.sort_by}`, query.sort_order)
          .skip((query.page - 1) * query.limit)
          .take(query.limit);

        const [items, total] = await qb.getManyAndCount();
        const dtos = items.map(s => plainToInstance(ProductSkuDTO, {
            ...s,
            spu_id: (s as any)?.spu?.id,
            attributes: ((s as any).sku_attributes || []).map((a: any) => ({
                key_id: a.attribute_key?.id,
                value_id: a.attribute_value?.id,
                key_name: a.attribute_key?.key || a.attribute_key?.name,
                value: a.attribute_value?.value_id || a.attribute_value?.value
            }))
        }));
        return { items: dtos, total };
    }

    async findById(id: string): Promise<ProductSkuDTO> {
        const s = await this.repository.findOne({ where: { id }, relations: ['sku_attributes', 'sku_attributes.attribute_key', 'sku_attributes.attribute_value', 'spu'] });
        if (!s) throw new HttpException(404, 'SKU不存在');
        return plainToInstance(ProductSkuDTO, { 
            ...s, 
            spu_id: (s as any)?.spu?.id,
            attributes: ((s as any).sku_attributes || []).map((a: any) => ({
                key_id: a.attribute_key?.id,
                value_id: a.attribute_value?.id,
                key_name: a.attribute_key?.key || a.attribute_key?.name,
                value: a.attribute_value?.value_id || a.attribute_value?.value
            }))
        });
    }

    async create(data: CreateProductSkuDto): Promise<ProductSkuDTO> {
        const s = this.repository.create({
            id: nanoid(16),
            sku_code: data.sku_code,
            sku_name: data.sku_name,
            price: data.price,
            original_price: data.original_price,
            cost_price: data.cost_price,
            stock: data.stock,
            status: data.status ?? ProductSkuStatus.ON_SHELF,
            is_default: data.is_default ?? false,
        });
        (s as any).spu = { id: data.spu_id } as any;
        const saved = await this.repository.save(s);
        return await this.findById(saved.id);
    }

    async update(id: string, data: UpdateProductSkuDto): Promise<ProductSkuDTO> {
        const s = await this.repository.findOne({ where: { id } });
        if (!s) throw new HttpException(404, 'SKU不存在');

        Object.assign(s, data);
        await this.repository.save(s);
        return await this.findById(id);
    }

    async remove(id: string): Promise<void> {
        const s = await this.repository.findOne({ where: { id } });
        if (!s) throw new HttpException(404, 'SKU不存在');
        await this.repository.remove(s);
    }
}


