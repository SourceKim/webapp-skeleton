/**
 * 示例：如何让后端 DTO 类实现 shared-types 中的接口
 * 
 * 这样既保证了类型一致性，又保留了验证功能
 */

import { IsString, IsEmail, IsOptional, Length, Matches, IsArray, MinLength, IsEnum, IsDateString } from 'class-validator';
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
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

/**
 * 更新用户请求 DTO
 * 实现 shared-types 中的接口，添加验证和转换装饰器
 */
export class UpdateUserDto implements IUpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @Length(3, 100, { message: '用户名长度必须在3-100个字符之间' })
  username?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  password?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @Length(1, 100, { message: '昵称长度必须在1-100个字符之间' })
  nickname?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserGender, { message: '性别不正确' })
  gender?: UserGender;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsDateString({}, { message: '出生日期格式不正确' })
  birthdate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

/**
 * 修改密码请求 DTO
 */
export class ChangePasswordDto implements IChangePasswordDto {
  @IsString()
  oldPassword!: string;

  @IsString()
  @MinLength(6, { message: '新密码长度不能少于6个字符' })
  newPassword!: string;
}

/**
 * 修改手机号请求 DTO
 */
export class ChangePhoneDto implements IChangePhoneDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone!: string;

  @IsString()
  password!: string;
}
