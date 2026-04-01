import type { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from "class-validator";

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  admissionDate: Date;
}

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  admissionDate?: Date;
}

export class TeacherDto {
  private constructor(
    public name: string,
    public email: string,
    public document: string,
    public degree: string,
    public specialization: string,
    public admissionDate: Date,
  ) {}

  public static from(teacher: Teacher | null): TeacherDto | null {
    if (!teacher) return null;
    return new TeacherDto(
      teacher.name,
      teacher.email,
      teacher.document,
      teacher.degree,
      teacher.specialization,
      teacher.admissionDate,
    );
  }
}
