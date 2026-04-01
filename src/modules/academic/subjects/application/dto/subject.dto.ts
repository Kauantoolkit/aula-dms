import type { Subject } from "@academic/subjects/domain/models/subject.entity";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  workload: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  workload?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class SubjectDto {
  private constructor(
    public name: string,
    public code: string,
    public workload: number,
    public description: string,
  ) {}

  public static from(subject: Subject | null): SubjectDto | null {
    if (!subject) return null;
    return new SubjectDto(
      subject.name,
      subject.code,
      subject.workload,
      subject.description,
    );
  }
}
