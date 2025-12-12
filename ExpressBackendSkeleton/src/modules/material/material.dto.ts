import { BaseDTO } from '@/modules/common/common.dto';
import { MaterialType } from '@/modules/material/material.model';
import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import { MaterialTag } from '@/modules/material/mateial-tag/material-tag.model';
import { User } from '@/modules/user/user.model';
import { Expose } from 'class-transformer';

export class MaterialDTO extends BaseDTO {


    @Expose()
    filename?: string;

    @Expose()
    original_name?: string;

    @Expose()
    file_path?: string;

    @Expose()
    mime_type?: string;

    @Expose()
    file_size?: number;

    @Expose()
    type!: MaterialType;

    @Expose()
    material_category?: MaterialCategory;

    @Expose()
    description?: string;

    @Expose()
    material_tags?: MaterialTag[];

    @Expose()
    user!: User;

    @Expose()
    is_public!: boolean;

    @Expose()
    upload_dir?: string;

    @Expose()
    metadata?: Record<string, any>;

    @Expose()
    parent_id?: string;

    @Expose()
    access_count!: number;

    @Expose()
    file_hash?: string;

    @Expose()
    url?: string;
}
    

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateMaterialDto, UpdateMaterialDto, MaterialQueryDto } from '@skeleton/shared-types'