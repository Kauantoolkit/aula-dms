import { AcademicModule } from "@academic/academic.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from './shared/infra/database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), AcademicModule, DatabaseModule],
})
export class AppModule {}
