import { Permission } from "@shared/domain/enums/permission.enum";
import type { User } from "@users/domain/models/user.entity";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];
}

export class UserResponseDto {
  private constructor(
    public id: string,
    public email: string,
    public teacherId: string | undefined,
    public permissions: string[],
    public createdAt: Date | undefined,
    public updatedAt: Date | undefined,
  ) {}

  static from(user: User | null): UserResponseDto | null {
    if (!user) return null;
    return new UserResponseDto(
      user.id!,
      user.email,
      user.teacherId,
      user.permissions,
      user.createdAt,
      user.updatedAt,
    );
  }
}

export interface UserPayload {
  id: string;
  email: string;
  permissions: string[];
}
