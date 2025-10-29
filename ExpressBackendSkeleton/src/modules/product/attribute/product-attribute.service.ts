import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductAttributeKey, AttributeType } from './product-attribute-key.model';
import { ProductAttributeValue } from './product-attribute-value.model';
import { nanoid } from 'nanoid';
import { HttpException } from '@/exceptions/http.exception';
import { plainToInstance } from 'class-transformer';
import { CreateProductAttributeKeyDto, CreateProductAttributeValueDto, ProductAttributeKeyDTO, ProductAttributeValueDTO, UpdateProductAttributeKeyDto, UpdateProductAttributeValueDto } from './product-attribute.dto';

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
        const k = this.keyRepo.create({ id: nanoid(16), name: dto.name, key: dto.key, type: dto.type, required: dto.required ?? false });
        (k as any).spu = { id: dto.spu_id } as any;
        await this.keyRepo.save(k);
        return plainToInstance(ProductAttributeKeyDTO, { ...k, spu_id: dto.spu_id });
    }

    async updateKey(id: string, dto: UpdateProductAttributeKeyDto): Promise<ProductAttributeKeyDTO> {
        const k = await this.keyRepo.findOne({ where: { id } });
        if (!k) throw new HttpException(404, '属性键不存在');
        Object.assign(k, dto);
        await this.keyRepo.save(k);
        return plainToInstance(ProductAttributeKeyDTO, { ...k, spu_id: (k as any).spu?.id });
    }

    async deleteKey(id: string): Promise<void> { await this.keyRepo.delete(id); }

    async createValue(dto: CreateProductAttributeValueDto): Promise<ProductAttributeValueDTO> {
        const v = this.valRepo.create({ id: nanoid(16), value: dto.value, value_id: dto.value_id });
        (v as any).attribute_key = { id: dto.attribute_key_id } as any;
        if (dto.image_id) (v as any).image = { id: dto.image_id } as any;
        v.color_hex = dto.color_hex;
        await this.valRepo.save(v);
        return plainToInstance(ProductAttributeValueDTO, { ...v, attribute_key_id: dto.attribute_key_id, image_id: dto.image_id });
    }

    async updateValue(id: string, dto: UpdateProductAttributeValueDto): Promise<ProductAttributeValueDTO> {
        const v = await this.valRepo.findOne({ where: { id }, relations: ['image', 'attribute_key'] });
        if (!v) throw new HttpException(404, '属性值不存在');
        if (dto.image_id !== undefined) (v as any).image = dto.image_id ? ({ id: dto.image_id } as any) : null;
        Object.assign(v, { value: dto.value ?? v.value, value_id: dto.value_id ?? v.value_id, color_hex: dto.color_hex ?? v.color_hex });
        await this.valRepo.save(v);
        return plainToInstance(ProductAttributeValueDTO, { ...v, attribute_key_id: (v as any).attribute_key?.id, image_id: (v as any).image?.id });
    }

    async deleteValue(id: string): Promise<void> { await this.valRepo.delete(id); }
}


