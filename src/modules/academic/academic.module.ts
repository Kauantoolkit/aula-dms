import { StudentsModule } from "@academic/students/students.module";
import { TeachersModule } from "@academic/teachers/teachers.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [StudentsModule, TeachersModule],
})
export class AcademicModule {}
