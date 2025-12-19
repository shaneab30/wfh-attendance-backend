import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Employee } from '../employees/employees.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() dto: CreateAttendanceDto, @CurrentUser() user: Employee) {
    console.log('Created by:', user.name);
    return this.attendanceService.create(dto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateAttendanceDto>,
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Patch(':id/checkout')
  updateCheckout(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCheckoutDto,
  ) {
    return this.attendanceService.updateCheckout(id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.attendanceService.findOne(+id);
  }
}
