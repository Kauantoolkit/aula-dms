import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { ClassOfferingStatus } from "@class-offering/domain/models/class-offering.entity";
import type { ClassOffering } from "@class-offering/domain/models/class-offering.entity";

export class CreateClassOfferingDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}

export class ChangeClassOfferingStatusDto {
  @IsEnum(ClassOfferingStatus)
  @IsNotEmpty()
  status: ClassOfferingStatus;
}

export class ClassOfferingDto {
  private constructor(
    public id: string | undefined,
    public subjectId: string,
    public teacherId: string,
    public startDate: Date,
    public endDate: Date,
    public status: ClassOfferingStatus,
  ) {}

  public static from(
    classOffering: ClassOffering | null,
  ): ClassOfferingDto | null {
    if (!classOffering) return null;
    return new ClassOfferingDto(
      classOffering.id,
      classOffering.subjectId,
      classOffering.teacherId,
      classOffering.startDate,
      classOffering.endDate,
      classOffering.status,
    );
  }
}
