import { Repository, DataSource } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { AppDataSource } from '@/configs/database.config';
import { ShopIntro, ShopIntroBanner } from './shop-intro.model';
import type { CreateShopIntroDto, UpdateShopIntroDto, ShopIntroResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { HttpException } from '@/exceptions/http.exception';
import { Material } from '@/modules/material/material.model';

export class ShopIntroService {
    private shopIntroRepository: Repository<ShopIntro>;
    private bannerRepository: Repository<ShopIntroBanner>;
    private materialRepository: Repository<Material>;
    private dataSource: DataSource;

    constructor() {
        this.shopIntroRepository = AppDataSource.getRepository(ShopIntro);
        this.bannerRepository = AppDataSource.getRepository(ShopIntroBanner);
        this.materialRepository = AppDataSource.getRepository(Material);
        this.dataSource = AppDataSource;
    }

    private generateId(): string {
        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
        return nanoid();
    }

    public async getShopIntro(): Promise<ShopIntroResponseDto | null> {
        const shopIntro = await this.shopIntroRepository.findOne({
            where: {},
            relations: ['banners', 'banners.material'],
            order: {
                created_at: 'DESC'
            }
        });

        if (!shopIntro) {
            return null;
        }

        // Sort banners by sort_order
        if (shopIntro.banners) {
            shopIntro.banners.sort((a, b) => a.sort_order - b.sort_order);
        }

        return transformToCamelCase(shopIntro) as unknown as ShopIntroResponseDto;
    }

    public async createOrUpdateShopIntro(dto: CreateShopIntroDto | UpdateShopIntroDto): Promise<ShopIntroResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let shopIntro = await queryRunner.manager.findOne(ShopIntro, {
                where: {},
                order: { created_at: 'DESC' }
            });

            if (!shopIntro) {
                shopIntro = queryRunner.manager.create(ShopIntro, {
                    id: this.generateId(),
                    ...dto
                });
            } else {
                Object.assign(shopIntro, {
                    name: dto.name,
                    introduction: dto.introduction,
                    detail: dto.detail,
                    contact_phone: dto.contact_phone,
                    longitude: dto.longitude,
                    latitude: dto.latitude,
                    address: dto.address
                });
            }

            await queryRunner.manager.save(shopIntro);

            // Handle banners
            if (dto.banner_ids) {
                // Delete existing banners
                await queryRunner.manager.delete(ShopIntroBanner, { shop_intro_id: shopIntro.id });

                // Verify materials exist
                for (const materialId of dto.banner_ids) {
                     const material = await this.materialRepository.findOne({ where: { id: materialId } });
                     if (!material) {
                         throw new HttpException(404, `素材 ID ${materialId} 不存在`);
                     }
                }

                // Create new banners
                const banners = dto.banner_ids.map((materialId, index) => {
                    return queryRunner.manager.create(ShopIntroBanner, {
                        id: this.generateId(),
                        shop_intro_id: shopIntro!.id,
                        material_id: materialId,
                        sort_order: index
                    });
                });

                await queryRunner.manager.save(banners);
            }

            await queryRunner.commitTransaction();

            return (await this.getShopIntro())!;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
