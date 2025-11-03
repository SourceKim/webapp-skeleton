import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/modules/common/common.dto';
import { CreateUserAddressDto, UpdateUserAddressDto, UserAddressDTO } from './user-address.dto';
import { UserAddressService } from './user-address.service';
import { FindByIdDto } from '@/modules/common/common.dto';

export class UserAddressController {
    private service = new UserAddressService();

    public list = async (
        req: Request,
        res: Response<ApiResponse<UserAddressDTO[]>>,
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
        res: Response<ApiResponse<UserAddressDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const userId = req.user!.id;
            const data = await this.service.findByIdForUser(id, userId);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public create = async (
        req: Request,
        res: Response<ApiResponse<UserAddressDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dto = await req.validate(CreateUserAddressDto, 'body');
            const userId = req.user!.id;
            const data = await this.service.createForUser(userId, dto);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: Request,
        res: Response<ApiResponse<UserAddressDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const dto = await req.validate(UpdateUserAddressDto, 'body');
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
            const { id } = await req.validate(FindByIdDto, 'params');
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
            const { id } = await req.validate(FindByIdDto, 'params');
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
        res: Response<any>,
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
        res: Response<ApiResponse<UserAddressDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const data = await this.service.adminFindById(id);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public adminUpdate = async (
        req: Request,
        res: Response<ApiResponse<UserAddressDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const dto = await req.validate(UpdateUserAddressDto, 'body');
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
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.service.adminDelete(id);
            res.json({ code: 0, message: 'success' });
        } catch (error) {
            next(error);
        }
    };
}


