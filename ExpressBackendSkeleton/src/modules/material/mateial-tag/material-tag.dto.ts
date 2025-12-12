import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';

export class MaterialTagDTO extends BaseDTO {
    @Expose()
    name!: string;

    @Expose()
    description?: string;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateMaterialTagDto, UpdateMaterialTagDto } from '@skeleton/shared-types'
