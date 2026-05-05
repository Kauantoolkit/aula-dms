import { CreateEnrollmentDto } from "@enrollment/application/dto/enrollment.dto";
import {
  Enrollment,
  EnrollmentStatus,
} from "@enrollment/domain/models/enrollment.entity";
import {
  ENROLLMENT_REPOSITORY,
  type EnrollmentRepository,
} from "@enrollment/domain/repositories/enrollment-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult } from "@shared/infra/hateoas";
import { QueueMappingService } from "@messaging/application/services/queue-mapping.service";

interface ListParams {
  classOfferingId?: string;
  page: number;
  limit: number;
}

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly queueMappingService: QueueMappingService,
  ) {}

  async listPaginated(params: ListParams): Promise<PaginatedResult<Enrollment>> {
    const { classOfferingId, page, limit } = params;

    if (!classOfferingId) {
      const data: Enrollment[] = [];
      const total = 0;
      return { data, total, page, limit };
    }

    const data = await this.enrollmentRepository.findPaginatedByClassOfferingId(classOfferingId, page, limit);
    const total = await this.enrollmentRepository.countByClassOfferingId(classOfferingId);
    return { data, total, page, limit };
  }

  async enroll(dto: CreateEnrollmentDto): Promise<Enrollment> {
    const existing = await this.enrollmentRepository.findByStudentAndClassOffering(
      dto.studentId,
      dto.classOfferingId,
    );

    if (existing) {
      throw new ConflictException(
        "Student is already enrolled in this class offering",
      );
    }

    const enrollment = Enrollment.restore({
      studentId: dto.studentId,
      classOfferingId: dto.classOfferingId,
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: new Date(),
    });

    const created = await this.enrollmentRepository.create(enrollment!);

    await this.queueMappingService.publishEnrollmentCreated({
      enrollmentId: created.id,
      studentId: dto.studentId,
      classOfferingId: dto.classOfferingId,
      status: created.status,
      enrolledAt: created.enrolledAt,
    });

    return created;
  }

  async cancel(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    await this.enrollmentRepository.cancel(id);

    await this.queueMappingService.publishEnrollmentCanceled({
      enrollmentId: id,
      studentId: enrollment.studentId,
      classOfferingId: enrollment.classOfferingId,
      status: "canceled",
      canceledAt: new Date(),
    });
  }

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    return enrollment;
  }
}

