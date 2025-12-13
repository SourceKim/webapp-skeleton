import { Router, Request, Response } from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { OrderService } from './order.service'
import type { OrderPreviewDto, CreateOrderDto } from '@skeleton/shared-types'
import { orderPreviewSchema, createOrderSchema } from '@skeleton/shared-types'
import { validateData } from '@/utils/zod-validator'
import { PaymentMethod } from './order.model'

const router = Router()
const service = new OrderService()

router.use(authMiddleware)

router.post('/preview', async (req: Request, res: Response) => {
  try {
    const dto = validateData(orderPreviewSchema, req.body)
    const data = await service.preview(req.user!.id, dto.cart_item_ids)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    const status = error?.status || 500
    res.status(status).json({ code: status, message: error?.message || '预览失败' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const dto = validateData(createOrderSchema, req.body)
    const paymentMethod = 'payment_method' in dto ? (dto as { payment_method?: string }).payment_method : undefined
    const order = await service.create(req.user!.id, dto.cart_item_ids, dto.address_id, dto.remark, paymentMethod as PaymentMethod | undefined)
    res.json({ code: 0, message: 'OK', data: order })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    const status = error?.status || 500
    res.status(status).json({ code: status, message: error?.message || '创建失败' })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await service.list(req.user!.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    res.status(error?.status || 500).json({ code: error?.status || 500, message: error?.message || '获取订单失败' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await service.detail(req.user!.id, req.params.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    const status = error?.status || 500
    res.status(status).json({ code: status, message: error?.message || '获取详情失败' })
  }
})

router.put('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const data = await service.cancel(req.user!.id, req.params.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    const status = error?.status || 500
    res.status(status).json({ code: status, message: error?.message || '取消失败' })
  }
})

router.put('/:id/pay', async (req: Request, res: Response) => {
  try {
    const { payment_method } = req.body as { payment_method?: string }
    const data = await service.pay(req.user!.id, req.params.id, payment_method as PaymentMethod | undefined)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    const status = error?.status || 500
    res.status(status).json({ code: status, message: error?.message || '支付失败' })
  }
})

router.put('/:id/receive', async (req: Request, res: Response) => {
  try {
    const data = await service.receive(req.user!.id, req.params.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string };
    const status = error?.status || 500
    res.status(status).json({ code: status, message: error?.message || '确认收货失败' })
  }
})

export default router


