import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { UserAddress, UserAddressStatus } from './user-address.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import { plainToInstance } from 'class-transformer';
import { UserAddressDTO } from './user-address.dto';
import type { CreateUserAddressDto, UpdateUserAddressDto } from '@skeleton/shared-types';

export class UserAddressService {
    private repo: Repository<UserAddress>;
    constructor() {
        this.repo = AppDataSource.getRepository(UserAddress);
    }

    async listByUser(userId: string): Promise<UserAddressDTO[]> {
        const items = await this.repo.find({ where: { user: { id: userId } as any }, order: { is_default: 'DESC', created_at: 'DESC' } as any });
        return items.map(it => this.toDto(it));
    }

    async findByIdForUser(id: string, userId: string): Promise<UserAddressDTO> {
        const entity = await this.repo.findOne({ where: { id, user: { id: userId } as any } });
        if (!entity) throw new HttpException(404, '地址不存在');
        return this.toDto(entity);
    }

    async createForUser(userId: string, data: CreateUserAddressDto): Promise<UserAddressDTO> {
        if (data.is_default) {
            await this.repo.createQueryBuilder()
                .update(UserAddress)
                .set({ is_default: false })
                .where('user_id = :userId', { userId })
                .execute();
        }

        const entity = this.repo.create({
            id: nanoid(16),
            user_id: userId,
            name: data.name,
            phone: data.phone,
            province: data.province,
            city: data.city,
            country: data.country,
            town: data.town,
            detail: data.detail,
            postal_code: data.postal_code,
            is_default: Boolean(data.is_default),
            tag: data.tag as any,
            status: UserAddressStatus.ACTIVE,
        });
        const saved = await this.repo.save(entity);
        return this.toDto(saved);
    }

    async updateForUser(id: string, userId: string, data: UpdateUserAddressDto): Promise<UserAddressDTO> {
        const entity = await this.repo.findOne({ where: { id, user: { id: userId } as any } });
        if (!entity) throw new HttpException(404, '地址不存在');

        if (data.is_default === true) {
            await this.repo.createQueryBuilder()
                .update(UserAddress)
                .set({ is_default: false })
                .where('user_id = :userId', { userId })
                .execute();
        }

        entity.name = data.name ?? entity.name;
        entity.phone = data.phone ?? entity.phone;
        entity.province = data.province ?? entity.province;
        entity.city = data.city ?? entity.city;
        entity.country = data.country ?? entity.country;
        entity.town = data.town ?? entity.town;
        entity.detail = data.detail ?? entity.detail;
        entity.postal_code = data.postal_code ?? entity.postal_code;
        entity.is_default = data.is_default ?? entity.is_default;
        if (data.tag !== undefined) entity.tag = data.tag as any;
        if (data.status !== undefined) entity.status = data.status as any;

        await this.repo.save(entity);
        return this.toDto(entity);
    }

    async deleteForUser(id: string, userId: string): Promise<void> {
        const entity = await this.repo.findOne({ where: { id, user: { id: userId } as any } });
        if (!entity) throw new HttpException(404, '地址不存在');
        await this.repo.remove(entity);
    }

    async setDefaultForUser(id: string, userId: string): Promise<void> {
        const entity = await this.repo.findOne({ where: { id, user: { id: userId } as any } });
        if (!entity) throw new HttpException(404, '地址不存在');
        await this.repo.createQueryBuilder()
            .update(UserAddress)
            .set({ is_default: false })
            .where('user_id = :userId', { userId })
            .execute();
        entity.is_default = true;
        await this.repo.save(entity);
    }

    // Admin
    async adminList(page: number, limit: number): Promise<{ items: UserAddressDTO[]; total: number }> {
        const [items, total] = await this.repo.findAndCount({
            order: { created_at: 'DESC' } as any,
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items: items.map(it => this.toDto(it)), total };
    }

    async adminFindById(id: string): Promise<UserAddressDTO> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new HttpException(404, '地址不存在');
        return this.toDto(entity);
    }

    async adminUpdate(id: string, data: UpdateUserAddressDto): Promise<UserAddressDTO> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new HttpException(404, '地址不存在');
        entity.name = data.name ?? entity.name;
        entity.phone = data.phone ?? entity.phone;
        entity.province = data.province ?? entity.province;
        entity.city = data.city ?? entity.city;
        entity.country = data.country ?? entity.country;
        entity.town = data.town ?? entity.town;
        entity.detail = data.detail ?? entity.detail;
        entity.postal_code = data.postal_code ?? entity.postal_code;
        entity.is_default = data.is_default ?? entity.is_default;
        if (data.tag !== undefined) entity.tag = data.tag as any;
        if (data.status !== undefined) entity.status = data.status as any;
        await this.repo.save(entity);
        return this.toDto(entity);
    }

    async adminDelete(id: string): Promise<void> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new HttpException(404, '地址不存在');
        await this.repo.remove(entity);
    }

    private toDto(entity: UserAddress): UserAddressDTO {
        return plainToInstance(UserAddressDTO, {
            ...entity,
            user_id: (entity as any)?.user?.id,
        });
    }
}


