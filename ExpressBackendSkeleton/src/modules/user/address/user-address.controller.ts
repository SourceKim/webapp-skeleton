import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { UserAddressResponseDto } from '@skeleton/shared-types';
import { UserAddressService } from './user-address.service';
import { createUserAddressSchema, updateUserAddressSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class UserAddressController {
    private service = new UserAddressService();

    public list = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto[]>>
    ): Promise<void> => {
        const userId = req.user!.id;
        const data = await this.service.listByUser(userId);
        res.json({ code: 0, message: 'success', data });
    });

    public detail = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const userId = req.user!.id;
        const data = await this.service.findByIdForUser(id, userId);
        res.json({ code: 0, message: 'success', data });
    });

    public create = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>
    ): Promise<void> => {
        const dto = validateData(createUserAddressSchema, req.body);
        const userId = req.user!.id;
        const data = await this.service.createForUser(userId, dto);
        res.json({ code: 0, message: 'success', data });
    });

    public update = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const dto = validateData(updateUserAddressSchema, req.body);
        const userId = req.user!.id;
        const data = await this.service.updateForUser(id, userId, dto);
        res.json({ code: 0, message: 'success', data });
    });

    public remove = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const userId = req.user!.id;
        await this.service.deleteForUser(id, userId);
        res.json({ code: 0, message: 'success' });
    });

    public setDefault = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const userId = req.user!.id;
        await this.service.setDefaultForUser(id, userId);
        res.json({ code: 0, message: 'success' });
    });

    // Admin
    public adminList = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<UserAddressResponseDto>>>
    ): Promise<void> => {
        const page = req.pagination.page;
        const limit = req.pagination.limit;
        const { items, total } = await this.service.adminList(page, limit);
        res.pagination(items, total);
    });

    public adminDetail = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const data = await this.service.adminFindById(id);
        res.json({ code: 0, message: 'success', data });
    });

    public adminUpdate = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserAddressResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const dto = validateData(updateUserAddressSchema, req.body);
        const data = await this.service.adminUpdate(id, dto);
        res.json({ code: 0, message: 'success', data });
    });

    public adminRemove = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.service.adminDelete(id);
        res.json({ code: 0, message: 'success' });
    });
}


