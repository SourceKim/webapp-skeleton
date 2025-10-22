import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '@/modules/user/user.model';
import { IsString, IsInt, IsBoolean, IsOptional, IsEnum, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';
import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import { MaterialTag } from '@/modules/material/mateial-tag/material-tag.model';

/**
 * 素材类型枚举
 */
export enum MaterialType {
    IMAGE = 'image',
    AUDIO = 'audio',
    VIDEO = 'video',
    DOCUMENT = 'document',
    TEXT = 'text',
    AVATAR = 'avatar',
    OTHER = 'other'
}

/**
 * 素材实体类
 * 用于管理各种类型的素材，包括图片、音频、视频、文档、文本等
 */
@Entity('materials')
export class Material extends BaseEntity {


    /**
     * 素材文件名
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '文件名长度不能超过255个字符' })
    filename?: string;

    /**
     * 素材原始文件名
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '原始文件名长度不能超过255个字符' })
    original_name?: string;

    /**
     * 素材存储路径
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 500, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: '路径长度不能超过500个字符' })
    file_path?: string;

    /**
     * 素材MIME类型
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'MIME类型长度不能超过100个字符' })
    mime_type?: string;

    /**
     * 素材文件大小（字节）
     * 对于文本类型素材，表示文本长度
     */
    @Column({ type: 'bigint', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0, { message: '文件大小不能为负数' })
    file_size?: number;

    /**
     * 素材类型
     */
    @Column({ 
        type: 'enum', 
        enum: MaterialType,
        default: MaterialType.OTHER
    })
    @IsEnum(MaterialType, { message: '素材类型不正确' })
    type!: MaterialType;

    /**
     * 素材描述
     * 对于文本类型素材，此字段存储文本内容
     */
    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    /**
     * 素材是否公开
     * true: 公开可访问
     * false: 需要权限访问
     */
    @Column({ type: 'boolean', default: false, name: 'is_public' })
    @IsBoolean()
    is_public: boolean = false;

    /**
     * 素材上传目录
     * 对于文本类型素材可为空
     */
    @Column({ type: 'varchar', length: 255, nullable: true, name: 'upload_dir' })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: '上传目录长度不能超过255个字符' })
    upload_dir?: string;

    /**
     * 素材所属用户
     * 通过外键关联到用户表
     */
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    /**
     * 素材分类关联
     * 通过外键关联到分类表
     */
    @ManyToOne(() => MaterialCategory, category => category.materials, { nullable: true })
    @JoinColumn({ name: 'material_category_id' })
    material_category?: MaterialCategory;

    /**
     * 素材标签关联
     * 多对多关系
     */
    @ManyToMany(() => MaterialTag, tag => tag.materials)
    @JoinTable({
        name: 'material_tag_relations',
        joinColumn: {
            name: 'material_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id'
        }
    })
    material_tags?: MaterialTag[];

    /**
     * 素材元数据
     * 以JSON对象形式存储额外信息
     * 例如：图片的宽高、视频的时长、音频的比特率等
     */
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    metadata?: Record<string, any>;

    /**
     * 父素材ID
     * 用于版本管理，指向原始素材
     */
    @Column({ type: 'varchar', length: 36, nullable: true, name: 'parent_id' })
    @IsOptional()
    @IsString()
    parent_id?: string;

    /**
     * 访问计数
     * 记录素材被访问的次数
     */
    @Column({ type: 'int', default: 0, name: 'access_count' })
    @IsInt()
    @Min(0, { message: '访问计数不能为负数' })
    access_count: number = 0;

    /**
     * 文件哈希值
     * 用于检测重复文件
     */
    @Column({ type: 'varchar', length: 64, nullable: true, name: 'file_hash' })
    @IsOptional()
    @IsString()
    @MaxLength(64, { message: '文件哈希值长度不能超过64个字符' })
    file_hash?: string;

    constructor(partial: Partial<Material> = {}) {
        super(partial);
    }
} 