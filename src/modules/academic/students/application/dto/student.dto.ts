import type { Student } from "@academic/students/domain/models/student.entity";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {
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
  registration: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  document?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  registration?: string;
}

export class StudentDto {
  private constructor(
    public name: string,
    public email: string,
    public document: string,
    public registration: string,
  ) {}

  public static from(student: Student | null): StudentDto | null {
    if (!student) return null;
    return new StudentDto(
      student.name,
      student.email,
      student.document,
      student.registration,
    );
  }
}
