/**
 * 示例：使用 Zod Schema 进行验证的控制器
 * 
 * 这个文件展示了如何使用 shared-types 中的 Zod Schema 替代 class-validator
 */

import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@/modules/auth/auth.service'
import { HttpException } from '@/exceptions/http.exception'
import { ApiResponse } from '@/modules/common/common.dto'
import { 
  loginSchema, 
  registerSchema,
  type LoginResponseDto,
  type RegisterResponseDto 
} from '@skeleton/shared-types'
import { validateData } from '@/utils/zod-validator'
import { logInfo, logError } from '@/utils/logger'

/**
 * 认证控制器（使用 Zod 验证）
 */
export class AuthControllerExample {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  /**
   * 用户注册
   * POST /api/auth/register
   * 
   * 使用示例：
   * router.post('/register', this.register)
   */
  register = async (
    req: Request,
    res: Response<ApiResponse<RegisterResponseDto>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 使用 Zod Schema 验证请求体
      const registerData = validateData(registerSchema, req.body)
      
      logInfo('用户注册请求', (req as any).requestId, { username: registerData.username })
      
      // 调用服务层
      const user = await this.authService.register(registerData)
      
      res.status(200).json({
        code: 0,
        message: '注册成功',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   * 
   * 使用示例：
   * router.post('/login', this.login)
   */
  login = async (
    req: Request,
    res: Response<ApiResponse<LoginResponseDto>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 使用 Zod Schema 验证请求体
      const loginData = validateData(loginSchema, req.body)
      
      logInfo('用户登录请求', (req as any).requestId, { username: loginData.username })
      
      // 调用服务层
      const result = await this.authService.login(loginData.username, loginData.password)
      
      res.status(200).json({
        code: 0,
        message: '登录成功',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

/**
 * 使用中间件方式的示例：
 * 
 * import { validateBody } from '@/utils/zod-validator'
 * import { loginSchema, registerSchema } from '@skeleton/shared-types'
 * 
 * router.post('/register', validateBody(registerSchema), authController.register)
 * router.post('/login', validateBody(loginSchema), authController.login)
 */
