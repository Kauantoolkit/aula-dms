import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PublishMessageDto {
  @ApiProperty({ example: "enrollment.created" })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({ example: { enrollmentId: "uuid", studentId: "uuid", classOfferingId: "uuid" } })
  @IsNotEmpty()
  data: Record<string, unknown>;
}

export class ConsumeMessageDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  data: Record<string, unknown>;

  @ApiProperty()
  queue: string;

  static from(queue: string, event: string, data: Record<string, unknown>): ConsumeMessageDto {
    const dto = new ConsumeMessageDto();
    dto.queue = queue;
    dto.event = event;
    dto.data = data;
    return dto;
  }
}