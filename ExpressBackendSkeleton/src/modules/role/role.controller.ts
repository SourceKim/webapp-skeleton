import { Request, Response } from 'express';
import { RoleService } from '@/modules/role/role.service';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { RoleResponseDto, UserResponseDto } from '@skeleton/shared-types';
import { 
    createRoleSchema,
    updateRoleSchema,
    assignPermissionsSchema,
    assignRolesSchema
} from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

/**
 * 角色控制器
 * 处理角色相关的请求
 */
export class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    /**
     * 获取所有角色
     * GET /api/roles
     */
    public findAllRoles = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<PaginatedResponse<RoleResponseDto>>>
    ): Promise<void> => {
        // 调用服务获取分页数据
        const { roles, total } = await this.roleService.findAllRoles(req.pagination);
        return res.pagination(roles, total);
    })

    /**
     * 根据ID获取角色
     * GET /api/roles/:id
     */
    public findRoleById = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const role = await this.roleService.findRoleById(id);
        
        res.json({
            code: 0,
            message: 'success',
            data: role
        });
    })

    /**
     * 创建角色
     * POST /api/roles
     */
    public createRole = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        const roleData = validateData(createRoleSchema, req.body);
        const role = await this.roleService.createRole(roleData);
        res.status(200).json({
            code: 0,
            message: '角色创建成功',
            data: role
        });
    })

    /**
     * 更新角色
     * PUT /api/roles/:id
     */
    public updateRole = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const roleData = validateData(updateRoleSchema, req.body);
        const role = await this.roleService.updateRole(id, roleData);
        
        res.json({
            code: 0,
            message: '角色更新成功',
            data: role
        });
    })

    /**
     * 删除角色
     * DELETE /api/roles/:id
     */
    public deleteRole = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.roleService.deleteRole(id);
        res.json({
            code: 0,
            message: '角色删除成功',
            data: undefined
        });
    })

    /**
     * 为角色分配权限
     * POST /api/roles/:roleId/permissions
     */
    public assignPermissionsToRole = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<RoleResponseDto>>
    ): Promise<void> => {
        const { roleId } = req.params;
        const data = validateData(assignPermissionsSchema, req.body);
        const role = await this.roleService.assignPermissionsToRole(roleId, data);
        
        res.json({
            code: 0,
            message: '权限分配成功',
            data: role
        });
    })

    /**
     * 为用户分配角色
     * POST /api/roles/users/:userId
     */
    public assignRolesToUser = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        const userId = req.params.userId;
        const data = validateData(assignRolesSchema, req.body);
        const user = await this.roleService.assignRolesToUser(userId, data);
        
        res.json({
            code: 0,
            message: '角色分配成功',
            data: user
        });
    })
} 