import type { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { ConflictException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateTeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async execute(dto: TeacherDto): Promise<void> {
    const existing = await this.teacherRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const teacher = Teacher.restore(dto);
    await this.teacherRepository.create(teacher!);
  }
}
