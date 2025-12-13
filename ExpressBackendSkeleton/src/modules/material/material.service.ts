import { Repository, In, Like, DataSource } from 'typeorm';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { nanoid } from 'nanoid';
import { 
    createDirIfNotExists, 
    getMaterialTypeFromMimetype, 
    getSubDirByType, 
    writeFile,
    calculateFileHash,
    deleteFileIfExists
} from '@/modules/material/material.util';
import { Material, MaterialType } from '@/modules/material/material.model';
import { MaterialTag } from '@/modules/material/mateial-tag/material-tag.model';
import { HttpException } from '@/exceptions/http.exception';
import { AppDataSource } from '@/configs/database.config';
import { ENV } from '@/configs/env.config';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import { logError, logDebug } from '@/utils/logger';
import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import type { CreateMaterialDto, MaterialResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

/**
 * 素材服务类
 * 提供素材的上传、查询、处理等功能
 */
export class MaterialService {
    /** 素材仓库 */
    private materialRepository: Repository<Material>;
    /** 默认上传目录 */
    private readonly defaultUploadDir: string;
    /** 数据源 */
    private readonly dataSource: DataSource;

    /**
     * 构造函数
     */
    constructor() {
        this.materialRepository = AppDataSource.getRepository(Material);
        this.dataSource = AppDataSource;
        // 从 UPLOADS_PATH 推导出文件系统目录路径（移除前导斜杠）
        const uploadsPath = ENV.UPLOADS_PATH.replace(/^\/+/, ''); // 移除前导斜杠，如 /uploads -> uploads
        this.defaultUploadDir = path.join(process.cwd(), uploadsPath); // 使用项目根目录
        
        // 确保上传目录存在
        createDirIfNotExists(this.defaultUploadDir);
    }

    /**
     * 生成唯一ID
     * @returns 生成的唯一ID
     */
    private generateId(): string {
        return nanoid();
    }

    /**
     * 上传文件
     * @param file 上传的文件
     * @param user 当前用户
     * @param options 上传选项
     * @returns 创建的素材对象
     */
    public async uploadFile(file: Express.Multer.File, user?: { id: string }, options?: CreateMaterialDto): Promise<Material> {
        try {
            const type = getMaterialTypeFromMimetype(file.mimetype);
            const subDir = getSubDirByType(type);
            const destDir = path.join(this.defaultUploadDir, subDir);
            
            // 确保目标目录存在
            createDirIfNotExists(destDir);
            
            // 文件已经通过multer存储，获取文件信息
            // 优先使用用户提供的filename，如果没有则使用multer生成的文件名
            const multerFilename = path.basename(file.path);
            const filename = options?.filename || multerFilename;
            // 以我们统一的子目录 + multer 存储文件名构造相对路径，避免中文被错误解释
            const relativePath = `${subDir}/${multerFilename}`.replace(/\\/g, '/');
            
            // 计算文件哈希值
            const fileHash = await calculateFileHash(file.path);
            
            // 检查文件是否已经存在（通过哈希值），若存在则直接返回该素材
            const existingMaterial = await this.materialRepository.findOne({ 
                where: { file_hash: fileHash },
                relations: ['material_category', 'material_tags', 'user']
            });
            if (existingMaterial) {
                // 删除刚上传的重复文件并直接返回已存在的素材
                await deleteFileIfExists(file.path);
                return existingMaterial;
            }
            
            // 开始数据库事务
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                // 使用 repository.create 创建素材记录
                const material = this.materialRepository.create({
                    id: this.generateId(),
                    filename: filename,
                    original_name: file.originalname,
                    file_path: relativePath,
                    mime_type: file.mimetype,
                    file_size: file.size,
                    type: type,
                    description: options?.description,
                    is_public: options?.is_public || false,
                    upload_dir: subDir,
                    user: user,
                    metadata: options?.metadata,
                    parent_id: options?.parent_id,
                    file_hash: fileHash,
                    access_count: 0
                });

                // 处理分类关联
                if (options?.categoryId) {
                    logDebug('接收到分类ID', undefined, { categoryId: options.categoryId });
                    const categoryRepository = queryRunner.manager.getRepository(MaterialCategory);
                    
                    const category = await categoryRepository.findOne({
                        where: { id: options.categoryId }
                    });

                    if (category) {
                        logDebug('找到对应分类', undefined, { categoryId: options.categoryId, categoryName: category.name });
                        material.material_category = category;
                    } else {
                        logDebug('未找到对应分类ID', undefined, { categoryId: options.categoryId });
                    }
                }

                // 保存素材基本信息
                const savedMaterial = await queryRunner.manager.save(material);

                // 处理标签关联
                if (options?.tags && options.tags.length > 0) {
                    logDebug('接收到标签ID列表', undefined, { tagIds: options.tags });
                    const tagRepository = queryRunner.manager.getRepository(MaterialTag);
                    const materialTags: MaterialTag[] = [];

                    // 批量查询所有标签
                    const foundTags = await tagRepository.find({
                        where: { id: In(options.tags) }
                    });
                    
                    logDebug(`已找到${foundTags.length}个标签，总共${options.tags.length}个ID`, undefined, { 
                        foundCount: foundTags.length, 
                        totalCount: options.tags.length 
                    });
                    
                    // 创建标签关联
                    foundTags.forEach(tag => {
                        materialTags.push(tag);
                    });
                    
                    // 记录未找到的标签ID
                    const foundTagIds = foundTags.map(tag => tag.id);
                    const notFoundTagIds = options.tags.filter(id => !foundTagIds.includes(id));
                    if (notFoundTagIds.length > 0) {
                        logDebug('未找到的标签ID', undefined, { notFoundTagIds });
                    }

                    // 设置素材的标签关联
                    if (materialTags.length > 0) {
                        savedMaterial.material_tags = materialTags;
                        await queryRunner.manager.save(savedMaterial);
                        logDebug('已保存标签关联', undefined, { tagCount: materialTags.length });
                    }
                }

                // 提交事务
                await queryRunner.commitTransaction();

                // 重新查询完整的素材信息（包含关联）
                const finalMaterial = await this.materialRepository.findOne({
                    where: { id: savedMaterial.id },
                    relations: ['material_category', 'material_tags', 'user']
                });

                if (!finalMaterial) {
                    throw new HttpException(500, '获取保存的素材失败');
                }

                return finalMaterial;
            } catch (error) {
                // 如果出错，回滚事务并清理文件
                await queryRunner.rollbackTransaction();
                await deleteFileIfExists(file.path);
                throw error;
            } finally {
                // 释放查询运行器
                await queryRunner.release();
            }
        } catch (error) {
            logError('上传文件失败', undefined, { error });
            // 确保在任何错误情况下都清理文件
            if (file?.path) {
                await deleteFileIfExists(file.path);
            }
            throw error instanceof HttpException ? error : new HttpException(500, '上传文件失败');
        }
    }

    async getMaterials(query: PaginationQueryDto): Promise<{ items: MaterialResponseDto[]; total: number }> {
        try {
            // 创建查询构建器，确保加载所有需要的关系
            const queryBuilder = this.materialRepository
                .createQueryBuilder('material')
                .leftJoinAndSelect('material.material_category', 'material_category')
                .leftJoinAndSelect('material.user', 'user')
                .leftJoinAndSelect('material.material_tags', 'material_tags');

            // 应用筛选条件
            if (query.filters) {
                const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'material');
                QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
            }

            // 排序
            queryBuilder.orderBy(`material.${query.sort_by}`, query.sort_order);

            // 分页
            const skip = (query.page - 1) * query.limit;
            queryBuilder.skip(skip).take(query.limit);

            // 执行查询，获取结果
            const [items, total] = await queryBuilder.getManyAndCount();
            const materialDTOs = items.map(item => transformToCamelCase(item) as MaterialResponseDto);

            return {
                items: materialDTOs,
                total
            };
        } catch (error) {
            logError('获取素材列表失败', undefined, { error });
            throw new HttpException(500, '获取素材列表失败', error);
        }
    }

    /**
     * 获取单个素材详情
     * @param id 素材ID
     * @returns 素材对象
     */
    public async getMaterialById(id: string): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({ 
                where: { id },
                relations: ['material_category', 'user', 'material_tags']
            });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            // 增加访问计数
            material.access_count += 1;
            await this.materialRepository.save(material);
            
            return material;
        } catch (error) {
            logError('获取素材详情失败', undefined, { error, materialId: id });
            throw error instanceof HttpException ? error : new HttpException(500, '获取素材详情失败');
        }
    }

    /**
     * 更新素材
     * @param id 素材ID
     * @param updateData 更新数据
     * @returns 更新后的素材对象
     */
    public async updateMaterial(id: string, updateData: Partial<Material>): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({ 
                where: { id },
                relations: ['material_category', 'material_tags']
            });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            // 更新素材基本信息
            Object.assign(material, updateData);
            
            // 保存更新
            const savedMaterial = await this.materialRepository.save(material);
            
            // 重新查询完整信息
            return await this.materialRepository.findOne({
                where: { id: savedMaterial.id },
                relations: ['material_category', 'material_tags', 'user']
            }) || savedMaterial;
        } catch (error) {
            logError('更新素材失败', undefined, { error, materialId: id });
            throw error instanceof HttpException ? error : new HttpException(500, '更新素材失败');
        }
    }

    /**
     * 删除素材
     * @param id 素材ID
     * @returns 是否删除成功
     */
    public async deleteMaterial(id: string): Promise<boolean> {
        try {
            const material = await this.materialRepository.findOne({ where: { id } });
            
            if (!material) {
                throw new HttpException(404, '素材不存在');
            }
            
            // 如果是文件类型素材，删除文件
            if (material.type !== MaterialType.TEXT && material.file_path) {
                const filePath = path.join(this.defaultUploadDir, material.file_path);
                await deleteFileIfExists(filePath);
            }
            
            // 删除素材记录
            await this.materialRepository.remove(material);
            
            return true;
        } catch (error) {
            logError('删除素材失败', undefined, { error, materialId: id });
            throw error instanceof HttpException ? error : new HttpException(500, '删除素材失败');
        }
    }

    /**
     * 检查重复文件
     * @param fileHash 文件哈希值
     * @returns 重复的素材对象（如果存在）
     */
    public async checkDuplicateFile(fileHash: string): Promise<Material | null> {
        try {
            const duplicateMaterial = await this.materialRepository.findOne({
                where: { file_hash: fileHash },
                relations: ['material_category', 'material_tags', 'user']
            });
            
            return duplicateMaterial;
        } catch (error) {
            logError('检查重复文件失败', undefined, { error, fileHash });
            return null;
        }
    }
} 