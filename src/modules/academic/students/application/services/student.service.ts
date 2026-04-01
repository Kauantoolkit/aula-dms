import {
  CreateStudentDto,
  StudentDto,
  UpdateStudentDto,
} from "@academic/students/application/dto/student.dto";
import { Student } from "@academic/students/domain/models/student.entity";
import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async create(dto: CreateStudentDto): Promise<void> {
    const existing = await this.studentRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const student = Student.restore(dto);
    await this.studentRepository.create(student!);
  }

  async edit(id: string, dto: UpdateStudentDto): Promise<void> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    if (dto.email && dto.email !== student.email) {
      const existing = await this.studentRepository.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException("Email already registered");
      }
    }

    if (dto.name !== undefined) {
      student.withName(dto.name);
    }
    if (dto.email !== undefined) {
      student.withEmail(dto.email);
    }
    if (dto.document !== undefined) {
      student.withDocument(dto.document);
    }
    if (dto.registration !== undefined) {
      student.withRegistration(dto.registration);
    }

    await this.studentRepository.update(student!);
  }

  async remove(id: string): Promise<void> {
    await this.studentRepository.delete(id);
  }

  async list(): Promise<StudentDto[]> {
    const response = await this.studentRepository.findAll();
    return response.map((row) => StudentDto.from(row)!);
  }

  async findById(id: string): Promise<StudentDto | null> {
    const response = await this.studentRepository.findById(id);
    return StudentDto.from(response);
  }

  async findByEmail(email: string): Promise<StudentDto | null> {
    const response = await this.studentRepository.findByEmail(email);
    return StudentDto.from(response);
  }
}
