import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Attendance } from 'src/attendance/attendance.entity';

export enum EmployeeRole {
  EMPLOYEE = 'EMPLOYEE',
  HRD = 'HRD',
  ADMIN = 'ADMIN',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ unique: true })
  employee_code: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.EMPLOYEE,
  })
  role: EmployeeRole;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Attendance, (a) => a.employee)
  attendances: Attendance[];
}
