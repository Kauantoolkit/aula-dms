import { CreateTeacherService } from "@academic/teachers/application/services/create-teacher.service";
import { EditTeacherService } from "@academic/teachers/application/services/edit-teacher.service";
import { ListTeachersService } from "@academic/teachers/application/services/list-teachers.service";
import { RemoveTeacherService } from "@academic/teachers/application/services/remove-teacher.service";
import { ReturnTeacherService } from "@academic/teachers/application/services/return-teacher.service";
import { TEACHER_REPOSITORY } from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { TeachersController } from "@academic/teachers/infra/controllers/teachers.controller";
import { DrizzleTeacherRepository } from "@academic/teachers/infra/repositories/drizzle-teacher.repository";
import { DatabaseModule } from "@infra/database/database.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule],
  controllers: [TeachersController],
  providers: [
    CreateTeacherService,
    EditTeacherService,
    ListTeachersService,
    ReturnTeacherService,
    RemoveTeacherService,
    DrizzleTeacherRepository,
    {
      provide: TEACHER_REPOSITORY,
      useExisting: DrizzleTeacherRepository,
    },
  ],
})
export class TeachersModule {}
