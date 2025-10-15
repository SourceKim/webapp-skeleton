import { In, Repository, DataSource } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { Product } from './product.model';
import { CreateProductDto, ProductDTO, ProductQueryDto, UpdateProductDto } from './product.dto';
import { nanoid } from 'nanoid';
import { Material } from '@/modules/material/material.model';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class ProductService {
  private productRepository: Repository<Product>;
  private materialRepository: Repository<Material>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.productRepository = dataSource.getRepository(Product);
    this.materialRepository = dataSource.getRepository(Material);
  }

  async findById(id: string): Promise<ProductDTO | null> {
    const product = await this.productRepository.findOne({ where: { id }, relations: { materials: true } });
    return product ? plainToInstance(ProductDTO, product) : null;
  }

  async findAndPaginate(query: PaginationQueryDto): Promise<{ items: ProductDTO[]; total: number }> {
    const qb = this.productRepository.createQueryBuilder('p')
      .leftJoinAndSelect('p.materials', 'm');

    // 筛选
    if (query.filters) {
      const conditions = QueryFilterBuilder.parseFilters(query.filters, 'p');
      QueryFilterBuilder.applyFilters(qb, conditions);
    }

    // 排序
    qb.orderBy(`p.${query.sort_by || 'created_at'}`, query.sort_order || 'DESC');

    const total = await qb.getCount();
    qb.skip((query.page - 1) * query.limit).take(query.limit);
    const items = await qb.getMany();
    return { items: items.map(i => plainToInstance(ProductDTO, i)), total };
  }

  async create(dto: CreateProductDto): Promise<ProductDTO> {
    const product = this.productRepository.create({
      id: nanoid(16),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      status: dto.status,
      category_id: dto.category_id
    });

    if (dto.material_ids && dto.material_ids.length > 0) {
      const materials = await this.materialRepository.findBy({ id: In(dto.material_ids) });
      product.materials = materials;
    }
    await this.productRepository.save(product);
    return plainToInstance(ProductDTO, product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDTO | null> {
    const product = await this.productRepository.findOne({ where: { id }, relations: { materials: true } });
    if (!product) return null;

    Object.assign(product, dto);
    if (dto.material_ids) {
      const materials = dto.material_ids.length > 0 ? await this.materialRepository.findBy({ id: In(dto.material_ids) }) : [];
      product.materials = materials;
    }
    await this.productRepository.save(product);
    return plainToInstance(ProductDTO, product);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) return false;
    await this.productRepository.remove(product);
    return true;
  }
}


