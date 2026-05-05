import { Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { QueueMappingService } from "@messaging/application/services/queue-mapping.service";
import { Public } from "@shared/infra/decorators/public.decorator";
import { ConsumeMessageDto } from "@messaging/application/dto/messaging.dto";

@ApiTags("messaging")
@Controller("messaging")
export class MessagingController {
  constructor(private readonly queueMappingService: QueueMappingService) {}

  @Post("setup")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Configurar exchanges e filas do RabbitMQ" })
  async setup(): Promise<void> {
    await this.queueMappingService.setupAsync();
  }

  @Get("consume/students/created")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem de student criado" })
  async consumeStudentCreated(): Promise<ConsumeMessageDto | null> {
    const data = await this.queueMappingService.consumeStudentCreated();
    if (!data) return null;
    return ConsumeMessageDto.from("enrollment.academic-students.created.queue", "student.created", data);
  }

  @Get("consume/students/updated")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem de student atualizado" })
  async consumeStudentUpdated(): Promise<ConsumeMessageDto | null> {
    const data = await this.queueMappingService.consumeStudentUpdated();
    if (!data) return null;
    return ConsumeMessageDto.from("enrollment.academic-students.updated.queue", "student.updated", data);
  }

  @Get("consume/students/deleted")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem de student deletado" })
  async consumeStudentDeleted(): Promise<ConsumeMessageDto | null> {
    const data = await this.queueMappingService.consumeStudentDeleted();
    if (!data) return null;
    return ConsumeMessageDto.from("enrollment.academic-students.deleted.queue", "student.deleted", data);
  }

  @Get("consume/class-offering/created")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem de class-offering criada" })
  async consumeClassOfferingCreated(): Promise<ConsumeMessageDto | null> {
    const data = await this.queueMappingService.consumeClassOfferingCreated();
    if (!data) return null;
    return ConsumeMessageDto.from("enrollment.class-offering.created.queue", "class-offering.created", data);
  }

  @Get("consume/class-offering/updated")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem de class-offering atualizada" })
  async consumeClassOfferingUpdated(): Promise<ConsumeMessageDto | null> {
    const data = await this.queueMappingService.consumeClassOfferingUpdated();
    if (!data) return null;
    return ConsumeMessageDto.from("enrollment.class-offering.updated.queue", "class-offering.updated", data);
  }

  @Get("consume/class-offering/canceled")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem de class-offering cancelada" })
  async consumeClassOfferingCanceled(): Promise<ConsumeMessageDto | null> {
    const data = await this.queueMappingService.consumeClassOfferingCanceled();
    if (!data) return null;
    return ConsumeMessageDto.from("enrollment.class-offering.canceled.queue", "class-offering.canceled", data);
  }
}