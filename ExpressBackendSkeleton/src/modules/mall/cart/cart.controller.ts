import { Request, Response, NextFunction } from 'express';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { CartDTO, AddCartItemDto, UpdateCartItemDto } from './cart.dto';
import { CartService } from './cart.service';

export class CartController {
  private service = new CartService();

  getMyCart = async (
    req: Request,
    res: Response<ApiResponse<CartDTO>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data = await this.service.getUserCart(userId);
      res.json({ code: 0, data });
    } catch (err) {
      next(err);
    }
  };

  addItem = async (
    req: Request,
    res: Response<ApiResponse<CartDTO>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const dto = await req.validate<AddCartItemDto>(AddCartItemDto, 'body');
      const data = await this.service.addItem(userId, dto);
      res.json({ code: 0, data });
    } catch (err) {
      next(err);
    }
  };

  updateItem = async (
    req: Request,
    res: Response<ApiResponse<CartDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const dto = await req.validate<UpdateCartItemDto>(UpdateCartItemDto, 'body');
      const data = await this.service.updateItem(userId, id, dto);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  removeItem = async (
    req: Request,
    res: Response<ApiResponse<CartDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const data = await this.service.removeItem(userId, id);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  clear = async (
    req: Request,
    res: Response<ApiResponse<CartDTO>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data = await this.service.clear(userId);
      res.json({ code: 0, data });
    } catch (err) {
      next(err);
    }
  };

  // Admin
  adminList = async (
    req: Request,
    res: Response<ApiResponse<PaginatedResponse<CartDTO>>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { items, total } = await this.service.adminPaginate(req.pagination!);
      res.pagination(items, total);
    } catch (err) {
      next(err);
    }
  };
}


