// @ts-nocheck
/* eslint-disable */
import { Request, Response, NextFunction } from 'express';
import { __PascalName__Service } from '@/modules/__kebabName__/__kebabName__.service';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { 
    Create__PascalName__Dto,
    Update__PascalName__Dto,
    __PascalName__DTO,
} from '@/modules/__kebabName__/__kebabName__.dto';

/**
 * __PascalName__ 控制器
 * 处理 __kebabName__ 相关请求
 */
export class __PascalName__Controller {
    private service: __PascalName__Service;

    constructor() {
        this.service = new __PascalName__Service();
    }

    /**
     * 获取分页列表
     * GET /api/__kebabNamePlural__/admin
     */
    public findAll = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<__PascalName__DTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { items, total } = await this.service.findAll(req.pagination);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 根据ID获取详情
     * GET /api/__kebabNamePlural__/admin/:id
     */
    public findById = async (
        req: Request,
        res: Response<ApiResponse<__PascalName__DTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const data = await this.service.findById(id);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 创建
     * POST /api/__kebabNamePlural__/admin
     */
    public create = async (
        req: Request,
        res: Response<ApiResponse<__PascalName__DTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const payload = await req.validate(Create__PascalName__Dto, 'body');
            const data = await this.service.create(payload);
            res.status(201).json({ code: 0, message: '创建成功', data });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 更新
     * PUT /api/__kebabNamePlural__/admin/:id
     */
    public update = async (
        req: Request,
        res: Response<ApiResponse<__PascalName__DTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const payload = await req.validate(Update__PascalName__Dto, 'body');
            const data = await this.service.update(id, payload);
            res.json({ code: 0, message: '更新成功', data });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 删除
     * DELETE /api/__kebabNamePlural__/admin/:id
     */
    public delete = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.service.delete(id);
            res.json({ code: 0, message: '删除成功', data: undefined });
        } catch (error) {
            next(error);
        }
    }
}


