import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { MaterialService } from '@/modules/material/material.service';
import { HttpException } from '@/exceptions/http.exception';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import { createMaterialSchema, updateMaterialSchema } from '@skeleton/shared-types';
import type { MaterialResponseDto } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { ENV } from '@/configs/env.config';
import { transformToCamelCase } from '@/utils/dto-transform.util';

import {
    parseTags,
    parseMetadata,
    createDirIfNotExists,
    deleteFileIfExists,
    isAllowedFileType,
    generateUniqueFilename,
    decodeLatin1ToUtf8,
    getSubDirByType,
    getMaterialTypeFromMimetype
} from '@/modules/material/material.util';
import { logError, logInfo } from '@/utils/logger';

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
        // 从 UPLOADS_PATH 推导出文件系统目录路径（移除前导斜杠）
        const uploadsPath = ENV.UPLOADS_PATH.replace(/^\/+/, ''); // 移除前导斜杠，如 /uploads -> uploads
        this.uploadDir = path.join(process.cwd(), uploadsPath); // 使用项目根目录
        createDirIfNotExists(this.uploadDir);
        this.upload = multer({ 
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    // 统一使用同一套判定，避免目录与DB不一致
                    const matType = getMaterialTypeFromMimetype(file.mimetype);
                    const subDirName = getSubDirByType(matType);
                    const subDir = path.join(this.uploadDir, subDirName);

                    createDirIfNotExists(subDir);
                    cb(null, subDir);
                },
                filename: (req, file, cb) => {
                    // 先修正原始文件名的编码，再生成唯一文件名
                    const decoded = decodeLatin1ToUtf8(file.originalname);
                    const filename = generateUniqueFilename(decoded);
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
    public uploadMaterial = async (req: Request, res: Response<ApiResponse<MaterialResponseDto>>, next: NextFunction): Promise<void> => {
        try {
            // 使用multer中间件处理文件上传
            this.upload.single('file')(req, res, async (err) => {
                try {
                    if (err) {
                        logError('文件上传错误', undefined, { error: err });
                        
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

                    // 使用 Zod 验证并构造数据
                    const materialData = validateData(createMaterialSchema, req.body);
                    // 修正文件名中文乱码（某些浏览器以 latin1 传 filename）
                    const decodedOriginal = decodeLatin1ToUtf8(req.file.originalname);
                    req.file.originalname = decodedOriginal;
                    
                    // 为缺失的字段设置默认值
                    if (!materialData.filename) {
                        materialData.filename = req.file.originalname;
                    }

                    // 统一规范化中文与特殊字符文件名，multer 已保存为 req.file.filename
                    // 这里仅记录日志与后续 service 处理

                    // 调用服务层处理文件上传和数据保存
                    const material = await this.materialService.uploadFile(req.file, req.user, materialData);

                    // 返回创建的素材信息
                    res.status(200).json({
                        code: 0,
                        message: '素材上传成功',
                        data: transformToCamelCase(material) as MaterialResponseDto
                    });
                } catch (error) {
                    // 如果出错且文件已上传，清理文件
                    if (req.file && req.file.path) {
                        await deleteFileIfExists(req.file.path);
                        logInfo('已清理上传失败的文件', undefined, { filePath: req.file.path });
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
        res: Response<ApiResponse<PaginatedResponse<MaterialResponseDto>>>,
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
        res: Response<ApiResponse<MaterialResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            
            // 获取素材
            const material = await this.materialService.getMaterialById(id);
            
            // 返回素材信息
            res.status(200).json({
                code: 0,
                message: '获取素材成功',
                data: transformToCamelCase(material) as MaterialResponseDto
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
        res: Response<ApiResponse<MaterialResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const updateData = validateData(updateMaterialSchema, req.body);
            
            // 更新素材
            const material = await this.materialService.updateMaterial(id, updateData);
            
            // 返回更新后的素材信息
            res.status(200).json({
                code: 0,
                message: '素材更新成功',
                data: transformToCamelCase(material) as MaterialResponseDto
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
            const { id } = validateData(idParamSchema, req.params);
            
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