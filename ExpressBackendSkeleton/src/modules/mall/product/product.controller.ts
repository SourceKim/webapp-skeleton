import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, ProductDTO, UpdateProductDto } from './product.dto';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';

export class ProductController {
  private service = new ProductService();

  getProducts = async (
    req: Request,
    res: Response<ApiResponse<PaginatedResponse<ProductDTO>>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { items, total } = await this.service.findAndPaginate(req.pagination!);
      res.pagination(items, total);
    } catch (err) {
      next(err);
    }
  };

  getProductById = async (
    req: Request,
    res: Response<ApiResponse<ProductDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.findById(id);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  createProduct = async (
    req: Request,
    res: Response<ApiResponse<ProductDTO>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = await req.validate<CreateProductDto>(CreateProductDto, 'body');
      const data = await this.service.create(dto);
      res.status(200).json({ code: 0, data });
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (
    req: Request,
    res: Response<ApiResponse<ProductDTO | null>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const dto = await req.validate<UpdateProductDto>(UpdateProductDto, 'body');
      const data = await this.service.update(id, dto);
      res.json({ code: data ? 0 : 404, data });
    } catch (err) {
      next(err);
    }
  };

  deleteProduct = async (
    req: Request,
    res: Response<ApiResponse<{ id: string } | undefined>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const ok = await this.service.delete(id);
      res.json({ code: ok ? 0 : 404, data: ok ? { id } : undefined });
    } catch (err) {
      next(err);
    }
  };
}


