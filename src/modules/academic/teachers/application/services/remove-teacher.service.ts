import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RemoveTeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.teacherRepository.delete(id);
  }
}
