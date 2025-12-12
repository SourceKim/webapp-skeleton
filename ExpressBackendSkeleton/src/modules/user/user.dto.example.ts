/**
 * 示例：如何让后端 DTO 类实现 shared-types 中的接口
 * 
 * 这样既保证了类型一致性，又保留了验证功能
 */

import { Transform } from 'class-transformer';
import type { 
  CreateUserDto as ICreateUserDto,
  UpdateUserDto as IUpdateUserDto,
  ChangePasswordDto as IChangePasswordDto,
  ChangePhoneDto as IChangePhoneDto
} from '@skeleton/shared-types';
import { UserGender } from '@skeleton/shared-types';

/**
 * 创建用户请求 DTO
 * 实现 shared-types 中的接口，添加验证装饰器
 */
export class CreateUserDto implements ICreateUserDto {
  username!: string;

  password!: string;

  email?: string;

  phone?: string;
}

/**
 * 更新用户请求 DTO
 * 实现 shared-types 中的接口，添加验证和转换装饰器
 */
export class UpdateUserDto implements IUpdateUserDto {
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  username?: string;

  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  password?: string;

  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  email?: string;

  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  nickname?: string;

  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  phone?: string;

  gender?: UserGender;

  @Transform(({ value }) => (value === '' ? undefined : value))
  birthdate?: string;

  roles?: string[];
}

/**
 * 修改密码请求 DTO
 */
export class ChangePasswordDto implements IChangePasswordDto {
  oldPassword!: string;

  newPassword!: string;
}

/**
 * 修改手机号请求 DTO
 */
export class ChangePhoneDto implements IChangePhoneDto {
  phone!: string;

  password!: string;
}
