import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Employee, EmployeeRole } from './employees.entity';
import { CreateEmployeesDto } from './dto/create-employees.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeesDto) {
    const existing = await this.employeeRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const employee = this.employeeRepo.create({
      employee_code: dto.employee_code,
      name: dto.name,
      email: dto.email,
      password_hash,
      role: EmployeeRole.EMPLOYEE,
    });

    return this.employeeRepo.save(employee);
  }

  async findAll() {
    return this.employeeRepo.find({
      select: [
        'id',
        'employee_code',
        'name',
        'email',
        'role',
        'is_active',
        'created_at',
      ],
    });
  }
}
