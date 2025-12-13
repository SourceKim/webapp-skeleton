import { Request, Response, NextFunction } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { UserAddressResponseDto } from '@skeleton/shared-types';
import { UserAddressService } from './user-address.service';
import { createUserAddressSchema, updateUserAddressSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

export class UserAddressController {
    private service = new UserAddressService();

    public list = async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto[]>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user!.id;
            const data = await this.service.listByUser(userId);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public detail = async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const userId = req.user!.id;
            const data = await this.service.findByIdForUser(id, userId);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public create = async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dto = validateData(createUserAddressSchema, req.body);
            const userId = req.user!.id;
            const data = await this.service.createForUser(userId, dto);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const dto = validateData(updateUserAddressSchema, req.body);
            const userId = req.user!.id;
            const data = await this.service.updateForUser(id, userId, dto);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public remove = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const userId = req.user!.id;
            await this.service.deleteForUser(id, userId);
            res.json({ code: 0, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public setDefault = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const userId = req.user!.id;
            await this.service.setDefaultForUser(id, userId);
            res.json({ code: 0, message: 'success' });
        } catch (error) {
            next(error);
        }
    };

    // Admin
    public adminList = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<UserAddressResponseDto>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const page = req.pagination.page;
            const limit = req.pagination.limit;
            const { items, total } = await this.service.adminList(page, limit);
            res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };

    public adminDetail = async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const data = await this.service.adminFindById(id);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public adminUpdate = async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const dto = validateData(updateUserAddressSchema, req.body);
            const data = await this.service.adminUpdate(id, dto);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public adminRemove = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            await this.service.adminDelete(id);
            res.json({ code: 0, message: 'success' });
        } catch (error) {
            next(error);
        }
    };
}


