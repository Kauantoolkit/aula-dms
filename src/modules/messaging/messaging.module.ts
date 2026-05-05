import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MessagingController } from "./infra/controllers/messaging.controller";
import { RabbitMQService } from "./infra/rabbitmq/rabbitmq.service";
import { QueueMappingService } from "./application/services/queue-mapping.service";

@Module({
  imports: [ConfigModule],
  controllers: [MessagingController],
  providers: [RabbitMQService, QueueMappingService],
})
export class MessagingModule {}