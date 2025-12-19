import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Employee, EmployeeRole } from './employees.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(EmployeeRole.ADMIN)
  @Roles(EmployeeRole.HRD)
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  findAll(@CurrentUser() user: Employee) {
    console.log('Current user:', user);
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(EmployeeRole.ADMIN)
  @Roles(EmployeeRole.HRD)
  update(@Param('id') id: number, @Body() dto: CreateEmployeeDto) {
    return this.employeesService.update(+id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.employeesService.deactivate(+id);
  }
}
