/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { EmployeeRole } from '../employees.entity';

export class CreateEmployeeDto {
  @IsNotEmpty()
  employee_code: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;
}
