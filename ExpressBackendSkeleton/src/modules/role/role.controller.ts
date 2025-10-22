import { Request, Response, NextFunction } from 'express';
import { RoleService } from '@/modules/role/role.service';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { 
    CreateRoleDto,
    UpdateRoleDto,
    AssignPermissionsDto,
    AssignRolesDto
} from '@/modules/role/role.dto';
import { RoleDTO } from '@/modules/role/role.dto';
import { UserDTO } from '@/modules/user/user.dto';

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
    public findAllRoles = async (
        req: Request, 
        res: Response<ApiResponse<PaginatedResponse<RoleDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 调用服务获取分页数据
            const { roles, total } = await this.roleService.findAllRoles(req.pagination);
            return res.pagination(roles, total);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 根据ID获取角色
     * GET /api/roles/:id
     */
    public findRoleById = async (
        req: Request, 
        res: Response<ApiResponse<RoleDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const role = await this.roleService.findRoleById(id);
            
            res.json({
                code: 0,
                message: 'success',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 创建角色
     * POST /api/roles
     */
    public createRole = async (
        req: Request, 
        res: Response<ApiResponse<RoleDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const roleData = await req.validate(CreateRoleDto, 'body');
            const role = await this.roleService.createRole(roleData);
            res.status(200).json({
                code: 0,
                message: '角色创建成功',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 更新角色
     * PUT /api/roles/:id
     */
    public updateRole = async (
        req: Request, 
        res: Response<ApiResponse<RoleDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const roleData = await req.validate(UpdateRoleDto, 'body');
            const role = await this.roleService.updateRole(id, roleData);
            
            res.json({
                code: 0,
                message: '角色更新成功',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 删除角色
     * DELETE /api/roles/:id
     */
    public deleteRole = async (
        req: Request, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.roleService.deleteRole(id);
            res.json({
                code: 0,
                message: '角色删除成功',
                data: undefined
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 为角色分配权限
     * POST /api/roles/:roleId/permissions
     */
    public assignPermissionsToRole = async (
        req: Request, 
        res: Response<ApiResponse<RoleDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { roleId } = req.params;
            const data = await req.validate(AssignPermissionsDto, 'body');
            const role = await this.roleService.assignPermissionsToRole(roleId, data);
            
            res.json({
                code: 0,
                message: '权限分配成功',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 为用户分配角色
     * POST /api/roles/users/:userId
     */
    public assignRolesToUser = async (
        req: Request, 
        res: Response<ApiResponse<UserDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.userId;
            const data = await req.validate(AssignRolesDto, 'body');
            const user = await this.roleService.assignRolesToUser(userId, data);
            
            res.json({
                code: 0,
                message: '角色分配成功',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
} 