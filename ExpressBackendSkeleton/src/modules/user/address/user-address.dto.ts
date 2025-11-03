import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, Length } from 'class-validator';
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

export class CreateUserAddressDto {
    @IsString()
    @MaxLength(50)
    name!: string;

    @IsString()
    @MaxLength(20)
    phone!: string;

    @IsString()
    @MaxLength(50)
    province!: string;

    @IsString()
    @MaxLength(50)
    city!: string;

    @IsString()
    @MaxLength(50)
    country!: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    town?: string;

    @IsString()
    @MaxLength(200)
    detail!: string;

    @IsOptional()
    @IsString()
    @Length(0, 10)
    postal_code?: string;

    @IsOptional()
    @IsBoolean()
    is_default?: boolean;

    @IsOptional()
    @IsEnum(UserAddressTag)
    tag?: UserAddressTag;
}

export class UpdateUserAddressDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    province?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    city?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    country?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    town?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    detail?: string;

    @IsOptional()
    @IsString()
    @Length(0, 10)
    postal_code?: string;

    @IsOptional()
    @IsBoolean()
    is_default?: boolean;

    @IsOptional()
    @IsEnum(UserAddressTag)
    tag?: UserAddressTag;

    @IsOptional()
    @IsEnum(UserAddressStatus)
    status?: UserAddressStatus;
}


