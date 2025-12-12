import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';
import { UserAddressStatus, UserAddressTag } from './user-address.model';

export class UserAddressDTO extends BaseDTO {
    @Expose()
    user_id!: string;

    @Expose()
    name!: string;

    @Expose()
    phone!: string;

    @Expose()
    province!: string;

    @Expose()
    city!: string;

    @Expose()
    country!: string;

    @Expose()
    town?: string;

    @Expose()
    detail!: string;

    @Expose()
    postal_code?: string;

    @Expose()
    is_default!: boolean;

    @Expose()
    tag?: UserAddressTag;

    @Expose()
    status!: UserAddressStatus;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateUserAddressDto, UpdateUserAddressDto } from '@skeleton/shared-types'


