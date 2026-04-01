import { EnrollmentService } from "@enrollment/application/services/enrollment.service";
import { EnrollmentDto } from "@enrollment/application/dto/enrollment.dto";
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";

import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";

@ApiTags("enrollments")
@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

@Get()
  @ApiOperation({ summary: "Listar matrículas por turma (filtros)" })
  @ApiResponse({ status: 200, description: "Lista de matrículas paginada" })
  async findByClassOffering(
    @Query("class_offering_id") classOfferingId: string,
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_size", new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Req() req: Request,
  ) {
    const result = await this.enrollmentService.listPaginatedByClassOffering(
      classOfferingId,
      page,
      size,
      this.baseUrl(req),
    );
    return result;
  }


  @Get(":id")
  @ApiOperation({ summary: "Buscar matrícula por ID" })
  @ApiParam({ name: "id", type: "string" })
  @ApiResponse({ status: 200, type: EnrollmentDto })
  @ApiResponse({ status: 404, description: "Matrícula não encontrada" })
  async findById(@Param("id") id: string, @Req() req: Request) {
    return this.enrollmentService.findById(id, this.baseUrl(req));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Matricular aluno em uma turma" })
  @ApiBody({
    schema: {
      properties: {
        studentId: { type: "string", example: "uuid" },
        classOfferingId: { type: "string", example: "uuid" },
      },
      required: ["studentId", "classOfferingId"],
    },
  })
  @ApiResponse({ status: 201, type: EnrollmentDto })
  @ApiResponse({ status: 409, description: "Aluno já matriculado nesta turma" })
  async enroll(
    @Body() body: { studentId: string; classOfferingId: string },
    @Req() req: Request,
  ) {
    return this.enrollmentService.enroll(body, this.baseUrl(req));
  }

  @Patch(":id/cancel")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Cancelar matrícula" })
  @ApiParam({ name: "id", type: "string" })
  @ApiResponse({ status: 204, description: "Matrícula cancelada com sucesso" })
  @ApiResponse({ status: 404, description: "Matrícula não encontrada" })
  async cancel(@Param("id") id: string) {
    await this.enrollmentService.cancelEnrollment(id);
  }


  private baseUrl(req: Request): string {
    return `${req.protocol}://${req.get("host")}`;
  }
}
