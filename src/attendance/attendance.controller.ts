/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Employee, EmployeeRole } from '../employees/employees.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/attendance',
        filename: (_req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async checkIn(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Employee,
  ) {
    if (!file) {
      throw new BadRequestException('Photo is required');
    }

    return this.attendanceService.checkIn({
      employeeId: user.id,
      photoPath: file.path,
    });
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(EmployeeRole.ADMIN, EmployeeRole.HRD)
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('me')
  findMine(@CurrentUser() user: Employee) {
    return this.attendanceService.findByEmployeeId(user.id);
  }

  @Patch(':id/checkout')
  updateCheckout(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.updateCheckout(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @Patch('checkout')
  checkoutCurrent(@CurrentUser() user: Employee) {
    return this.attendanceService.checkoutByEmployee(user.id);
  }
}
