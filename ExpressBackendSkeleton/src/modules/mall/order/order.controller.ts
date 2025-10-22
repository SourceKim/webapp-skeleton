import { Request, Response, NextFunction } from 'express';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { OrderDTO, CreateOrderDto } from './order.dto';
import { OrderService } from './order.service';

export class OrderController {
  private service = new OrderService();

  createFromCart = async (
    req: Request,
    res: Response<ApiResponse<OrderDTO>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const dto = await req.validate<CreateOrderDto>(CreateOrderDto, 'body');
      const data = await this.service.createFromCart(userId, dto);
      res.json({ code: 0, data });
    } catch (err) {
      next(err);
    }
  };

  myOrders = async (
    req: Request,
    res: Response<ApiResponse<PaginatedResponse<OrderDTO>>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { items, total } = await this.service.getMyOrders(userId, req.pagination!);
      res.pagination(items, total);
    } catch (err) {
      next(err);
    }
  };

  myOrderDetail = async (
    req: Request,
    res: Response<ApiResponse<OrderDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const data = await this.service.getMyOrderDetail(userId, id);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  confirm = async (
    req: Request,
    res: Response<ApiResponse<OrderDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const data = await this.service.confirm(userId, id);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  cancel = async (
    req: Request,
    res: Response<ApiResponse<OrderDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const data = await this.service.cancel(userId, id);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  // Admin
  ship = async (
    req: Request,
    res: Response<ApiResponse<OrderDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const { shipping_no } = req.body as { shipping_no: string };
      const data = await this.service.ship(req.user!.id, id, shipping_no);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  complete = async (
    req: Request,
    res: Response<ApiResponse<OrderDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const data = await this.service.complete(userId, id);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  adminList = async (
    req: Request,
    res: Response<ApiResponse<PaginatedResponse<OrderDTO>>>,
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


