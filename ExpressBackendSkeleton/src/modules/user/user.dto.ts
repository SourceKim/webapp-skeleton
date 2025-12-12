import { Expose, Transform } from "class-transformer";
import { BaseDTO } from "../common/common.dto";
import { RoleDTO } from "../role/role.dto";
import { UserGender } from './user.model';

// 用户基础的 dto
export class UserDTO extends BaseDTO {
    @Expose()
    username: string = '';

    @Expose()
    email: string = '';

    @Expose()
    phone: string = '';

    @Expose()
    avatar: string = '';

    @Expose()
    status: string = '';

    @Expose()
    roles: RoleDTO[] = [];
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateUserDto, UpdateUserDto, ChangePasswordDto, ChangePhoneDto } from '@skeleton/shared-types'
