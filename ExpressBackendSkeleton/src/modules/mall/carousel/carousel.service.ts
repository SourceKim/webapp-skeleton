import { Repository, DataSource } from 'typeorm';
import { nanoid } from 'nanoid';
import { AppDataSource } from '../../../configs/database.config';
import { Carousel } from './carousel.model';
import { CarouselDTO } from './carousel.dto';
import type { CreateCarouselDto, UpdateCarouselDto } from '@skeleton/shared-types';
import { PaginationQueryDto } from '../../common/common.dto';
import { QueryFilterBuilder } from '../../../utils/query-filter.util';
import { plainToInstance } from 'class-transformer';
import { HttpException } from '../../../exceptions/http.exception';
import { Material } from '../../material/material.model';
import { ProductSpu } from '../../product/spu/product-spu.model';

export class CarouselService {
    private carouselRepository: Repository<Carousel>;
    private materialRepository: Repository<Material>;
    private productSpuRepository: Repository<ProductSpu>;

    constructor() {
        this.carouselRepository = AppDataSource.getRepository(Carousel);
        this.materialRepository = AppDataSource.getRepository(Material);
        this.productSpuRepository = AppDataSource.getRepository(ProductSpu);
    }

    private generateId(): string {
        return nanoid();
    }

    public async createCarousel(createDto: CreateCarouselDto): Promise<CarouselDTO> {
        const { material_id, spu_id } = createDto;

        // Check if material exists
        const material = await this.materialRepository.findOne({ where: { id: material_id } });
        if (!material) {
            throw new HttpException(404, '关联的图片素材不存在');
        }

        // Check if spu exists if provided
        if (spu_id) {
            const spu = await this.productSpuRepository.findOne({ where: { id: spu_id } });
            if (!spu) {
                throw new HttpException(404, '关联的商品SPU不存在');
            }
        }

        const carousel = this.carouselRepository.create({
            id: this.generateId(),
            ...createDto
        });

        const savedCarousel = await this.carouselRepository.save(carousel);
        return this.findOne(savedCarousel.id);
    }

    public async updateCarousel(id: string, updateDto: UpdateCarouselDto): Promise<CarouselDTO> {
        const carousel = await this.carouselRepository.findOne({ where: { id } });
        if (!carousel) {
            throw new HttpException(404, '轮播图不存在');
        }

        const { material_id, spu_id } = updateDto;

        if (material_id) {
            const material = await this.materialRepository.findOne({ where: { id: material_id } });
            if (!material) {
                throw new HttpException(404, '关联的图片素材不存在');
            }
        }

        if (spu_id) {
            const spu = await this.productSpuRepository.findOne({ where: { id: spu_id } });
            if (!spu) {
                throw new HttpException(404, '关联的商品SPU不存在');
            }
        }

        Object.assign(carousel, updateDto);
        const savedCarousel = await this.carouselRepository.save(carousel);
        return this.findOne(savedCarousel.id);
    }

    public async deleteCarousel(id: string): Promise<boolean> {
        const carousel = await this.carouselRepository.findOne({ where: { id } });
        if (!carousel) {
            throw new HttpException(404, '轮播图不存在');
        }

        await this.carouselRepository.remove(carousel);
        return true;
    }

    public async findOne(id: string): Promise<CarouselDTO> {
        const carousel = await this.carouselRepository.findOne({
            where: { id },
            relations: ['material', 'spu']
        });

        if (!carousel) {
            throw new HttpException(404, '轮播图不存在');
        }

        return plainToInstance(CarouselDTO, carousel, { excludeExtraneousValues: true });
    }

    public async findAll(query: PaginationQueryDto): Promise<{ items: CarouselDTO[]; total: number }> {
        const queryBuilder = this.carouselRepository.createQueryBuilder('carousel')
            .leftJoinAndSelect('carousel.material', 'material')
            .leftJoinAndSelect('carousel.spu', 'spu')
            .leftJoinAndSelect('spu.main_material', 'spu_main_material'); // 加载 SPU 主图

        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'carousel');
            QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
        }

        queryBuilder.orderBy(`carousel.${query.sort_by}`, query.sort_order);

        const skip = (query.page - 1) * query.limit;
        queryBuilder.skip(skip).take(query.limit);

        const [items, total] = await queryBuilder.getManyAndCount();
        const dtos = items.map(item => plainToInstance(CarouselDTO, item, { excludeExtraneousValues: true }));

        return { items: dtos, total };
    }
}
