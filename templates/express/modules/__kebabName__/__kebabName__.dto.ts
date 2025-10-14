// @ts-nocheck
/* eslint-disable */
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';

export class __PascalName__DTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description: string = '';
}

export class Create__PascalName__Dto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class Update__PascalName__Dto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}


