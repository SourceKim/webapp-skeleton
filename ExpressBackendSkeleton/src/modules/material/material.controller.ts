import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { plainToInstance } from 'class-transformer';
import { MaterialService } from '@/modules/material/material.service';
import { CreateMaterialDto, UpdateMaterialDto } from '@/modules/material/material.dto';
import { HttpException } from '@/exceptions/http.exception';
import { ApiResponse, PaginatedResponse, FindByIdDto } from '@/modules/common/common.dto';
import { ENV } from '@/configs/env.config';
import { MaterialDTO } from '@/modules/material/material.dto';

import {
    getFileTypeFromMime,
    parseTags,
    parseMetadata,
    createDirIfNotExists,
    deleteFileIfExists,
    isAllowedFileType,
    generateUniqueFilename
} from '@/modules/material/material.util';

/**
 * 素材控制器
 * 提供素材管理的API接口
 */
export class MaterialController {
    private materialService = new MaterialService();
    private uploadDir: string;
    private upload: multer.Multer;

    /**
     * 构造函数
     */
    constructor() {
        // 使用环境变量中配置的上传目录
        this.uploadDir = path.resolve(ENV.UPLOAD_DIR);
        createDirIfNotExists(this.uploadDir);
        this.upload = multer({ 
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    // 根据文件类型创建子目录
                    const fileType = getFileTypeFromMime(file.mimetype);
                    const subDir = path.join(this.uploadDir, fileType);
                    
                    // 确保子目录存在
                    createDirIfNotExists(subDir);
                    
                    cb(null, subDir);
                },
                filename: (req, file, cb) => {
                    // 生成唯一文件名
                    const filename = generateUniqueFilename(file.originalname);
                    cb(null, filename);
                }
            }),
            limits: {
                fileSize: ENV.MAX_FILE_SIZE // 默认10MB
            },
            fileFilter: (req, file, cb) => {
                // 使用工具函数检查文件类型
                if (isAllowedFileType(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error(`不支持的文件类型: ${file.mimetype}`));
                }
            }
        });
    }

    /**
     * 上传素材文件
     * POST /api/v1/materials/upload
     * 
     * @description 支持单文件上传，自动检测文件类型并分类存储
     * @param req - 包含文件和元数据的请求
     * @param res - 返回上传成功的素材信息
     * @param next - 错误处理中间件
     */
    public uploadMaterial = async (req: any, res: Response<ApiResponse<MaterialDTO>>, next: NextFunction): Promise<void> => {
        try {
            // 使用multer中间件处理文件上传
            this.upload.single('file')(req, res, async (err) => {
                try {
                    if (err) {
                        console.error('文件上传错误:', err);
                        
                        if (err instanceof multer.MulterError) {
                            switch (err.code) {
                                case 'LIMIT_FILE_SIZE':
                                    throw new HttpException(400, `文件大小超过限制 (${ENV.MAX_FILE_SIZE / 1024 / 1024}MB)`);
                                case 'LIMIT_FILE_COUNT':
                                    throw new HttpException(400, '文件数量超过限制');
                                case 'LIMIT_UNEXPECTED_FILE':
                                    throw new HttpException(400, '意外的文件字段');
                                default:
                                    throw new HttpException(400, `文件上传失败: ${err.message}`);
                            }
                        }
                        
                        throw new HttpException(400, `文件上传失败: ${err.message}`);
                    }

                    // 检查是否有文件
                    if (!req.file) {
                        throw new HttpException(400, '请选择要上传的文件');
                    }

                    // 检查用户信息
                    if (!req.user) {
                        throw new HttpException(401, '用户未登录');
                    }

                    // 预处理 form-data 中的特殊字段
                    if (req.body.tags) {
                        req.body.tags = parseTags(req.body.tags);
                    }
                    if (req.body.metadata) {
                        req.body.metadata = parseMetadata(req.body.metadata);
                    }
                    if (req.body.is_public) {
                        req.body.is_public = req.body.is_public === 'true' || req.body.is_public === true;
                    }
                    
                    // 处理字段映射：category -> categoryId
                    if (req.body.category) {
                        req.body.categoryId = req.body.category;
                        delete req.body.category;
                    }

                    // 使用 req.validate 验证并构造 DTO
                    const materialData = await req.validate(CreateMaterialDto, 'body');
                    
                    // 为缺失的字段设置默认值
                    if (!materialData.filename) {
                        materialData.filename = req.file.originalname;
                    }

                    console.log('验证后的素材数据:', materialData);
                    console.log('上传的文件信息:', {
                        originalname: req.file.originalname,
                        filename: req.file.filename,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        path: req.file.path
                    });

                    // 调用服务层处理文件上传和数据保存
                    const material = await this.materialService.uploadFile(req.file, req.user, materialData);

                    // 返回创建的素材信息
                    res.status(201).json({
                        code: 0,
                        message: '素材上传成功',
                        data: plainToInstance(MaterialDTO, material)
                    });
                } catch (error) {
                    // 如果出错且文件已上传，清理文件
                    if (req.file && req.file.path) {
                        await deleteFileIfExists(req.file.path);
                        console.log('已清理上传失败的文件:', req.file.path);
                    }
                    next(error);
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材列表
     * GET /api/v1/materials
     */
    public getMaterials = async (
        req: Request, 
        res: Response<ApiResponse<PaginatedResponse<MaterialDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { items, total } = await this.materialService.getMaterials(req.pagination);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取素材详情
     * GET /api/v1/materials/:id
     */
    public getMaterialById = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            
            // 获取素材
            const material = await this.materialService.getMaterialById(id);
            
            // 返回素材信息
            res.status(200).json({
                code: 0,
                message: '获取素材成功',
                data: plainToInstance(MaterialDTO, material)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新素材
     * PUT /api/v1/materials/admin/:id
     */
    public updateMaterial = async (
        req: Request, 
        res: Response<ApiResponse<MaterialDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const updateData = await req.validate(UpdateMaterialDto, 'body');
            
            // 更新素材
            const material = await this.materialService.updateMaterial(id, updateData);
            
            // 返回更新后的素材信息
            res.status(200).json({
                code: 0,
                message: '素材更新成功',
                data: plainToInstance(MaterialDTO, material)
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 删除素材
     * DELETE /api/v1/materials/admin/:id
     */
    public deleteMaterial = async (
        req: Request, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            
            // 删除素材
            await this.materialService.deleteMaterial(id);
            
            // 返回成功信息
            res.status(200).json({
                code: 0,
                message: '素材删除成功'
            });
        } catch (error) {
            next(error);
        }
    };
} 