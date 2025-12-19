export class AttendanceResponseDto {
  id: number;
  employee_id: number;
  attendance_date: string;
  check_in_time: string;
  check_out_time: string;
  photo_path: string;
  status: string;
}
