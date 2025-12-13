import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductAttributeKey } from './product-attribute-key.model';
import { ProductAttributeValue } from './product-attribute-value.model';
import { Material } from '@/modules/material/material.model';
import { nanoid } from 'nanoid';
import { HttpException } from '@/exceptions/http.exception';
import type { CreateProductAttributeKeyDto, CreateProductAttributeValueDto, UpdateProductAttributeKeyDto, UpdateProductAttributeValueDto, ProductAttributeKeyResponseDto, ProductAttributeValueResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';

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

    async listKeysBySpu(spuId: string): Promise<ProductAttributeKeyResponseDto[]> {
        const keys = await this.keyRepo.find({ where: { spu_id: spuId }, relations: ['values'] });
        return keys.map(k => transformToCamelCase({ ...k, spu_id: k.spu_id }) as ProductAttributeKeyResponseDto);
    }

    async createKey(dto: CreateProductAttributeKeyDto): Promise<ProductAttributeKeyResponseDto> {
        // 自动生成 key，如果用户提供了则使用用户提供的，否则根据 name 生成
        const key = dto.key || generateKeyFromName(dto.name);
        const k = this.keyRepo.create({ 
            id: nanoid(16), 
            name: dto.name, 
            key, 
            required: dto.required ?? false,
            spu_id: dto.spu_id
        });
        await this.keyRepo.save(k);
        return transformToCamelCase({ ...k, spu_id: dto.spu_id }) as ProductAttributeKeyResponseDto;
    }

    async updateKey(id: string, dto: UpdateProductAttributeKeyDto): Promise<ProductAttributeKeyResponseDto> {
        const k = await this.keyRepo.findOne({ where: { id }, relations: ['spu'] });
        if (!k) throw new HttpException(404, '属性键不存在');
        // 如果更新了 name 且没有提供 key，则重新生成 key
        if (dto.name && !dto.key) {
            dto.key = generateKeyFromName(dto.name);
        }
        Object.assign(k, dto);
        await this.keyRepo.save(k);
        return transformToCamelCase({ ...k, spu_id: k.spu_id }) as ProductAttributeKeyResponseDto;
    }

    async deleteKey(id: string): Promise<void> { await this.keyRepo.delete(id); }

    async createValue(dto: CreateProductAttributeValueDto): Promise<ProductAttributeValueResponseDto> {
        // 自动生成 value_id，如果用户提供了则使用用户提供的，否则使用 nanoid
        const value_id = dto.value_id || nanoid(12);
        const v = this.valRepo.create({ 
            id: nanoid(16), 
            value: dto.value, 
            value_id,
            attribute_key_id: dto.attribute_key_id
        });
        // 设置 image 关系（如果提供了 image_id）
        if (dto.image_id) {
            v.image = { id: dto.image_id } as Material;
        }
        await this.valRepo.save(v);
        const saved = await this.valRepo.findOne({ where: { id: v.id }, relations: ['image', 'attribute_key'] });
        return transformToCamelCase({ 
            ...saved!, 
            attribute_key_id: dto.attribute_key_id, 
            image_id: saved?.image?.id 
        }) as ProductAttributeValueResponseDto;
    }

    async updateValue(id: string, dto: UpdateProductAttributeValueDto): Promise<ProductAttributeValueResponseDto> {
        const v = await this.valRepo.findOne({ where: { id }, relations: ['image', 'attribute_key'] });
        if (!v) throw new HttpException(404, '属性值不存在');
        if (dto.image_id !== undefined) {
            v.image = dto.image_id ? ({ id: dto.image_id } as Material) : null;
        }
        Object.assign(v, { value: dto.value ?? v.value, value_id: dto.value_id ?? v.value_id });
        await this.valRepo.save(v);
        const updated = await this.valRepo.findOne({ where: { id }, relations: ['image', 'attribute_key'] });
        return transformToCamelCase({ 
            ...updated!, 
            attribute_key_id: updated?.attribute_key_id || '', 
            image_id: updated?.image?.id 
        }) as ProductAttributeValueResponseDto;
    }

    async deleteValue(id: string): Promise<void> { await this.valRepo.delete(id); }
}


