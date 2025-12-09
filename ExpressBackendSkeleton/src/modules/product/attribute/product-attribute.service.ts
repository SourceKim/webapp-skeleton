import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductAttributeKey } from './product-attribute-key.model';
import { ProductAttributeValue } from './product-attribute-value.model';
import { nanoid } from 'nanoid';
import { HttpException } from '@/exceptions/http.exception';
import { plainToInstance } from 'class-transformer';
import { CreateProductAttributeKeyDto, CreateProductAttributeValueDto, ProductAttributeKeyDTO, ProductAttributeValueDTO, UpdateProductAttributeKeyDto, UpdateProductAttributeValueDto } from './product-attribute.dto';

/**
 * 根据名称生成键名（key）
 * 将中文、空格、特殊字符转换为下划线，并转为小写
 */
function generateKeyFromName(name: string): string {
    return name
        .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文
        .replace(/[^\w\s-]/g, '') // 移除特殊字符，保留字母数字下划线空格连字符
        .replace(/\s+/g, '_') // 空格转下划线
        .replace(/-+/g, '_') // 连字符转下划线
        .replace(/_+/g, '_') // 多个下划线合并为一个
        .replace(/^_|_$/g, '') // 移除首尾下划线
        .toLowerCase() // 转小写
        || `attr_${nanoid(8)}`; // 如果结果为空，生成一个默认值
}

export class ProductAttributeService {
    private keyRepo: Repository<ProductAttributeKey>;
    private valRepo: Repository<ProductAttributeValue>;
    constructor() {
        this.keyRepo = AppDataSource.getRepository(ProductAttributeKey);
        this.valRepo = AppDataSource.getRepository(ProductAttributeValue);
    }

    async listKeysBySpu(spuId: string): Promise<ProductAttributeKeyDTO[]> {
        const keys = await this.keyRepo.find({ where: { spu: { id: spuId } as any }, relations: ['values'] });
        return keys.map(k => plainToInstance(ProductAttributeKeyDTO, { ...k, spu_id: (k as any).spu?.id }));
    }

    async createKey(dto: CreateProductAttributeKeyDto): Promise<ProductAttributeKeyDTO> {
        // 自动生成 key，如果用户提供了则使用用户提供的，否则根据 name 生成
        const key = dto.key || generateKeyFromName(dto.name);
        const k = this.keyRepo.create({ id: nanoid(16), name: dto.name, key, required: dto.required ?? false });
        (k as any).spu = { id: dto.spu_id } as any;
        await this.keyRepo.save(k);
        return plainToInstance(ProductAttributeKeyDTO, { ...k, spu_id: dto.spu_id });
    }

    async updateKey(id: string, dto: UpdateProductAttributeKeyDto): Promise<ProductAttributeKeyDTO> {
        const k = await this.keyRepo.findOne({ where: { id } });
        if (!k) throw new HttpException(404, '属性键不存在');
        // 如果更新了 name 且没有提供 key，则重新生成 key
        if (dto.name && !dto.key) {
            dto.key = generateKeyFromName(dto.name);
        }
        Object.assign(k, dto);
        await this.keyRepo.save(k);
        return plainToInstance(ProductAttributeKeyDTO, { ...k, spu_id: (k as any).spu?.id });
    }

    async deleteKey(id: string): Promise<void> { await this.keyRepo.delete(id); }

    async createValue(dto: CreateProductAttributeValueDto): Promise<ProductAttributeValueDTO> {
        // 自动生成 value_id，如果用户提供了则使用用户提供的，否则使用 nanoid
        const value_id = dto.value_id || nanoid(12);
        const v = this.valRepo.create({ id: nanoid(16), value: dto.value, value_id });
        (v as any).attribute_key = { id: dto.attribute_key_id } as any;
        if (dto.image_id) (v as any).image = { id: dto.image_id } as any;
        await this.valRepo.save(v);
        return plainToInstance(ProductAttributeValueDTO, { ...v, attribute_key_id: dto.attribute_key_id, image_id: dto.image_id });
    }

    async updateValue(id: string, dto: UpdateProductAttributeValueDto): Promise<ProductAttributeValueDTO> {
        const v = await this.valRepo.findOne({ where: { id }, relations: ['image', 'attribute_key'] });
        if (!v) throw new HttpException(404, '属性值不存在');
        if (dto.image_id !== undefined) (v as any).image = dto.image_id ? ({ id: dto.image_id } as any) : null;
        Object.assign(v, { value: dto.value ?? v.value, value_id: dto.value_id ?? v.value_id });
        await this.valRepo.save(v);
        return plainToInstance(ProductAttributeValueDTO, { ...v, attribute_key_id: (v as any).attribute_key?.id, image_id: (v as any).image?.id });
    }

    async deleteValue(id: string): Promise<void> { await this.valRepo.delete(id); }
}


