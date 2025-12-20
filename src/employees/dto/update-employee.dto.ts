import { IsOptional, MinLength } from 'class-validator';
import { EmployeeRole } from '../employees.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  employee_code?: string;

  @IsOptional()
  role?: EmployeeRole;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
