import { EnrollmentModule } from "@enrollment/enrollment.module";
import { MessagingModule } from "@messaging/messaging.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [ConfigModule.forRoot(), SharedModule, EnrollmentModule, MessagingModule],
})
export class AppModule {}
