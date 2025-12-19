import { IsDateString, IsNumber, IsString } from 'class-validator';
import { AttendanceStatus } from '../attendance.entity';

export class CreateAttendanceDto {
  @IsNumber()
  employee_id: number;

  @IsDateString()
  attendance_date: string;

  @IsString()
  check_in_time?: string;

  @IsString()
  check_out_time?: string;

  @IsString()
  photo_path?: string;

  status?: AttendanceStatus;
}
