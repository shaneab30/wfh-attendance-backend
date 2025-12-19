import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Employee, EmployeeRole } from './employees.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const existing = await this.employeeRepo.findOne({
      where: [{ email: dto.email }, { employee_code: dto.employee_code }],
    });

    if (existing) {
      if (existing.email === dto.email) {
        throw new ConflictException('Email already exists');
      }
      throw new ConflictException('Employee code already exists');
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

  async findOne(id: number) {
    const employee = await this.employeeRepo.findOne({
      where: { id },
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

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }
  async update(id: number, dto: Partial<CreateEmployeeDto>) {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (dto.email || dto.employee_code) {
      const whereConditions: any[] = [];

      if (dto.email) {
        whereConditions.push({ email: dto.email, id: Not(id) });
      }
      if (dto.employee_code) {
        whereConditions.push({ employee_code: dto.employee_code, id: Not(id) });
      }

      const conflicts = await this.employeeRepo.findOne({
        where: whereConditions,
      });

      if (conflicts) {
        if (conflicts.email === dto.email) {
          throw new ConflictException('Email already exists');
        }
        throw new ConflictException('Employee code already exists');
      }
    }

    if (dto.password) {
      dto['password_hash'] = await bcrypt.hash(dto.password, 10);
      delete dto.password;
    }

    await this.employeeRepo.update(id, dto);
    return this.findOne(id);
  }

  async deactivate(id: number) {
    const employee = await this.findOne(id);
    employee.is_active = false;
    return this.employeeRepo.save(employee);
  }
}
