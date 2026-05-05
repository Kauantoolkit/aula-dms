import { Injectable, Logger } from "@nestjs/common";
import { RabbitMQService } from "../../infra/rabbitmq/rabbitmq.service";

const EXCHANGES = {
  STUDENTS_CREATED: "academic.students.created.exchange",
  STUDENTS_UPDATED: "academic.students.updated.exchange",
  STUDENTS_DELETED: "academic.students.deleted.exchange",
  CLASS_OFFERING_CREATED: "class-offering.created.exchange",
  CLASS_OFFERING_UPDATED: "class-offering.updated.exchange",
  CLASS_OFFERING_CANCELED: "class-offering.canceled.exchange",
  ENROLLMENT_CREATED: "enrollment.created.exchange",
  ENROLLMENT_CANCELED: "enrollment.canceled.exchange",
};

const QUEUES = {
  STUDENTS_CREATED: "enrollment.academic-students.created.queue",
  STUDENTS_UPDATED: "enrollment.academic-students.updated.queue",
  STUDENTS_DELETED: "enrollment.academic-students.deleted.queue",
  CLASS_OFFERING_CREATED: "enrollment.class-offering.created.queue",
  CLASS_OFFERING_UPDATED: "enrollment.class-offering.updated.queue",
  CLASS_OFFERING_CANCELED: "enrollment.class-offering.canceled.queue",
};

const ROUTING_KEYS = {
  STUDENT_CREATED: "student.created",
  STUDENT_UPDATED: "student.updated",
  STUDENT_DELETED: "student.deleted",
  CLASS_OFFERING_CREATED: "class-offering.created",
  CLASS_OFFERING_UPDATED: "class-offering.updated",
  CLASS_OFFERING_CANCELED: "class-offering.canceled",
};

@Injectable()
export class QueueMappingService {
  private readonly logger = new Logger(QueueMappingService.name);
  private initialized = false;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async setupAsync(): Promise<void> {
    if (this.initialized) return;
    if (!this.rabbitMQService.isConnected()) {
      this.logger.warn("RabbitMQ not connected, skipping queue setup");
      return;
    }

    await this.setupExchanges();
    await this.setupQueues();
    await this.bindQueues();

    this.initialized = true;
    this.logger.log("Queue mapping configured successfully");
  }

  private async setupExchanges(): Promise<void> {
    await this.rabbitMQService.assertExchange(EXCHANGES.STUDENTS_CREATED);
    await this.rabbitMQService.assertExchange(EXCHANGES.STUDENTS_UPDATED);
    await this.rabbitMQService.assertExchange(EXCHANGES.STUDENTS_DELETED);
    await this.rabbitMQService.assertExchange(EXCHANGES.CLASS_OFFERING_CREATED);
    await this.rabbitMQService.assertExchange(EXCHANGES.CLASS_OFFERING_UPDATED);
    await this.rabbitMQService.assertExchange(EXCHANGES.CLASS_OFFERING_CANCELED);
    await this.rabbitMQService.assertExchange(EXCHANGES.ENROLLMENT_CREATED);
    await this.rabbitMQService.assertExchange(EXCHANGES.ENROLLMENT_CANCELED);
    this.logger.log("Exchanges asserted");
  }

  private async setupQueues(): Promise<void> {
    await this.rabbitMQService.assertQueue(QUEUES.STUDENTS_CREATED);
    await this.rabbitMQService.assertQueue(QUEUES.STUDENTS_UPDATED);
    await this.rabbitMQService.assertQueue(QUEUES.STUDENTS_DELETED);
    await this.rabbitMQService.assertQueue(QUEUES.CLASS_OFFERING_CREATED);
    await this.rabbitMQService.assertQueue(QUEUES.CLASS_OFFERING_UPDATED);
    await this.rabbitMQService.assertQueue(QUEUES.CLASS_OFFERING_CANCELED);
    this.logger.log("Queues asserted");
  }

  private async bindQueues(): Promise<void> {
    await this.rabbitMQService.bindQueue(QUEUES.STUDENTS_CREATED, EXCHANGES.STUDENTS_CREATED, ROUTING_KEYS.STUDENT_CREATED);
    await this.rabbitMQService.bindQueue(QUEUES.STUDENTS_UPDATED, EXCHANGES.STUDENTS_UPDATED, ROUTING_KEYS.STUDENT_UPDATED);
    await this.rabbitMQService.bindQueue(QUEUES.STUDENTS_DELETED, EXCHANGES.STUDENTS_DELETED, ROUTING_KEYS.STUDENT_DELETED);
    await this.rabbitMQService.bindQueue(QUEUES.CLASS_OFFERING_CREATED, EXCHANGES.CLASS_OFFERING_CREATED, ROUTING_KEYS.CLASS_OFFERING_CREATED);
    await this.rabbitMQService.bindQueue(QUEUES.CLASS_OFFERING_UPDATED, EXCHANGES.CLASS_OFFERING_UPDATED, ROUTING_KEYS.CLASS_OFFERING_UPDATED);
    await this.rabbitMQService.bindQueue(QUEUES.CLASS_OFFERING_CANCELED, EXCHANGES.CLASS_OFFERING_CANCELED, ROUTING_KEYS.CLASS_OFFERING_CANCELED);
    this.logger.log("Queues bound");
  }

  async publishEnrollmentCreated(data: Record<string, unknown>): Promise<void> {
    await this.rabbitMQService.publish(EXCHANGES.ENROLLMENT_CREATED, "enrollment.created", data);
  }

  async publishEnrollmentCanceled(data: Record<string, unknown>): Promise<void> {
    await this.rabbitMQService.publish(EXCHANGES.ENROLLMENT_CANCELED, "enrollment.canceled", data);
  }

  async consumeStudentCreated(): Promise<Record<string, unknown> | null> {
    return this.rabbitMQService.consume(QUEUES.STUDENTS_CREATED);
  }

  async consumeStudentUpdated(): Promise<Record<string, unknown> | null> {
    return this.rabbitMQService.consume(QUEUES.STUDENTS_UPDATED);
  }

  async consumeStudentDeleted(): Promise<Record<string, unknown> | null> {
    return this.rabbitMQService.consume(QUEUES.STUDENTS_DELETED);
  }

  async consumeClassOfferingCreated(): Promise<Record<string, unknown> | null> {
    return this.rabbitMQService.consume(QUEUES.CLASS_OFFERING_CREATED);
  }

  async consumeClassOfferingUpdated(): Promise<Record<string, unknown> | null> {
    return this.rabbitMQService.consume(QUEUES.CLASS_OFFERING_UPDATED);
  }

  async consumeClassOfferingCanceled(): Promise<Record<string, unknown> | null> {
    return this.rabbitMQService.consume(QUEUES.CLASS_OFFERING_CANCELED);
  }
}