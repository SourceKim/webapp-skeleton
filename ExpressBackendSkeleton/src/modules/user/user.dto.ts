import { Expose, Transform } from "class-transformer";
import { BaseDTO } from "../common/common.dto";
import { RoleDTO } from "../role/role.dto";
import { IsString, IsEmail, IsOptional, Length, Matches, IsArray, IsBoolean, MinLength, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
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

// 创建用户请求 DTO
export class CreateUserDto {
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

// 更新用户请求 DTO
export class UpdateUserDto {
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
    @Transform(({ value }) => (value === '' || value === null ? undefined : value))
    @IsString()
    avatar?: string;

    @IsOptional()
    @Transform(({ value }) => (value === '' || value === null ? undefined : value))
    @Length(0, 500, { message: '简介长度不能超过500个字符' })
    bio?: string;

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

export class ChangePasswordDto {
    @IsNotEmpty({ message: '旧密码不能为空' })
    oldPassword!: string;

    @IsNotEmpty({ message: '新密码不能为空' })
    @MinLength(6, { message: '新密码长度不能少于6个字符' })
    newPassword!: string;
}

export class ChangePhoneDto {
    @IsNotEmpty({ message: '手机号不能为空' })
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
    phone!: string;

    @IsNotEmpty({ message: '密码不能为空' })
    password!: string;
}
