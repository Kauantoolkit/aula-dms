import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import type { Attendance } from "@attendance/domain/models/attendance.entity";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @IsString()
  @IsNotEmpty()
  classOfferingId: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}

export class AttendanceDto {
  private constructor(
    public studentId: string,
    public lessonId: string,
    public classOfferingId: string,
    public status: AttendanceStatus,
  ) {}

  public static from(attendance: Attendance | null): AttendanceDto | null {
    if (!attendance) return null;
    return new AttendanceDto(
      attendance.studentId,
      attendance.lessonId,
      attendance.classOfferingId,
      attendance.status,
    );
  }
}
