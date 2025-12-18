import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../employees/employees.entity';

export enum AttendanceStatus {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  employee_id: number;

  @Column({ type: 'date' })
  attendance_date: string;

  @Column({ type: 'time', nullable: true })
  check_in_time: string;

  @Column({ type: 'time', nullable: true })
  check_out_time: string;

  @Column({ nullable: true })
  photo_path: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ON_TIME,
  })
  status: AttendanceStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Employee, (e) => e.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
