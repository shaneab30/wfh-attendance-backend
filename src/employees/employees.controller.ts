import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeesDto } from './dto/create-employees.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() dto: CreateEmployeesDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }
}
