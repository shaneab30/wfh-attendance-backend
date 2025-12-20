import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async checkIn({
    employeeId,
    photoPath,
  }: {
    employeeId: number;
    photoPath: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);

    const existing = await this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.employee_id = :employeeId', { employeeId })
      .andWhere('DATE(attendance.attendance_date) = DATE(:today)', {
        today: today.toISOString().split('T')[0],
      })
      .getOne();

    if (existing) {
      throw new BadRequestException('Already checked in today');
    }

    const attendance = this.attendanceRepo.create({
      employee_id: employeeId,
      attendance_date: today,
      check_in_time: timeString,
      status: AttendanceStatus.ON_TIME,
      photo_path: photoPath,
    });

    return this.attendanceRepo.save(attendance);
  }

  async updateCheckout(id: number) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    if (attendance.check_out_time) {
      throw new BadRequestException('Already checked out');
    }

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    attendance.check_out_time = timeString;

    return this.attendanceRepo.save(attendance);
  }

  async findAll() {
    return this.attendanceRepo.find({
      order: { attendance_date: 'DESC' },
      select: [
        'id',
        'employee_id',
        'attendance_date',
        'check_in_time',
        'check_out_time',
        'photo_path',
        'status',
      ],
    });
  }

  async findByEmployeeId(employee_id: number) {
    return this.attendanceRepo.find({
      where: { employee_id },
      order: { attendance_date: 'DESC' },
      select: [
        'id',
        'employee_id',
        'attendance_date',
        'check_in_time',
        'check_out_time',
        'photo_path',
        'status',
      ],
    });
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  async checkoutByEmployee(employeeId: number) {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.employee_id = :employeeId', { employeeId })
      .andWhere('DATE(attendance.attendance_date) = DATE(:today)', { today })
      .getOne();

    if (!attendance) {
      throw new NotFoundException('No check-in found for today');
    }

    if (attendance.check_out_time) {
      throw new BadRequestException('Already checked out today');
    }

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    attendance.check_out_time = timeString;

    return this.attendanceRepo.save(attendance);
  }
}
