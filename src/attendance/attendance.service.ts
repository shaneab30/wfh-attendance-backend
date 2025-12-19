import { Injectable } from '@nestjs/common';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async create(dto: CreateAttendanceDto) {
    const exist = await this.attendanceRepo.exists({
      where: {
        employee_id: dto.employee_id,
        attendance_date: new Date(dto.attendance_date),
      },
    });

    if (exist) {
      throw new BadRequestException(
        'Attendance for this employee on the given date already exists.',
        { cause: { attendance_date: dto.attendance_date } },
      );
    }
    const attendance = this.attendanceRepo.create({
      employee_id: dto.employee_id,
      attendance_date: dto.attendance_date,
      check_in_time: dto.check_in_time,
      check_out_time: dto.check_out_time,
      photo_path: dto.photo_path,
      status: dto.status,
    });

    return this.attendanceRepo.save(attendance);
  }

  async findAll() {
    return this.attendanceRepo.find({
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

  async update(id: number, dto: Partial<CreateAttendanceDto>) {
    const checkAttendance = await this.attendanceRepo.findOne({
      where: { id },
    });

    if (!checkAttendance) {
      throw new NotFoundException('Attendance record not found.');
    }

    await this.attendanceRepo.update(id, dto);
    return this.attendanceRepo.findOne({ where: { id } });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async updateCheckout(id: number, dto: UpdateCheckoutDto) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    if (attendance.check_out_time) {
      throw new BadRequestException('Employee has already checked out');
    }

    const checkInMinutes = this.timeToMinutes(attendance.check_in_time);
    const checkOutMinutes = this.timeToMinutes(dto.check_out_time);

    if (checkOutMinutes < checkInMinutes) {
      throw new BadRequestException(
        'Check-out time cannot be earlier than check-in time',
      );
    }

    attendance.check_out_time = dto.check_out_time;

    return this.attendanceRepo.save(attendance);
  }

  async findOne(id: number) {
    const checkAttendance = await this.attendanceRepo.findOne({
      where: { id },
    });

    if (!checkAttendance) {
      throw new NotFoundException('Attendance record not found.');
    }

    return this.attendanceRepo.findOne({
      where: { id },
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
}
