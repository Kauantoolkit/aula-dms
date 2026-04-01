import { ClassOfferingService } from "@class-offering/application/services/class-offering.service";
import {
  ChangeClassOfferingStatusDto,
  CreateClassOfferingDto,
} from "@class-offering/application/dto/class-offering.dto";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

@Controller("class-offerings")
export class ClassOfferingsController {
  constructor(private readonly classOfferingService: ClassOfferingService) {}

  @Get()
  async findAll() {
    return this.classOfferingService.list();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.classOfferingService.findById(id);
  }

  @Post()
  async create(@Body() body: CreateClassOfferingDto) {
    return this.classOfferingService.create(body);
  }

  @Patch(":id/status")
  async changeStatus(
    @Param("id") id: string,
    @Body() body: ChangeClassOfferingStatusDto,
  ) {
    return this.classOfferingService.changeStatus(id, body.status);
  }
}
