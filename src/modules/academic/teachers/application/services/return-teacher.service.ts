import { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ReturnTeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async executeById(id: string): Promise<TeacherDto | null> {
    const response = await this.teacherRepository.findById(id);
    return TeacherDto.fromTeacher(response);
  }

  async executeByEmail(email: string): Promise<TeacherDto | null> {
    const response = await this.teacherRepository.findByEmail(email);
    return TeacherDto.fromTeacher(response);
  }
}
