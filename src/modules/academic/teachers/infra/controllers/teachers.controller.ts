import { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import { CreateTeacherService } from "@academic/teachers/application/services/create-teacher.service";
import { EditTeacherService } from "@academic/teachers/application/services/edit-teacher.service";
import { ListTeachersService } from "@academic/teachers/application/services/list-teachers.service";
import { RemoveTeacherService } from "@academic/teachers/application/services/remove-teacher.service";
import { ReturnTeacherService } from "@academic/teachers/application/services/return-teacher.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

@Controller("teachers")
export class TeachersController {
  constructor(
    private readonly createTeacherService: CreateTeacherService,
    private readonly editTeacherService: EditTeacherService,
    private readonly listTeachersService: ListTeachersService,
    private readonly returnTeacherService: ReturnTeacherService,
    private readonly removeTeacherService: RemoveTeacherService,
  ) {}

  @Get()
  async findAll() {
    return this.listTeachersService.execute();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.returnTeacherService.executeById(id);
  }

  @Post()
  async create(@Body() body: TeacherDto) {
    return this.createTeacherService.execute(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: TeacherDto) {
    return this.editTeacherService.execute(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.removeTeacherService.execute(id);
  }
}
