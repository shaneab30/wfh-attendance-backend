import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../employees/employees.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const employee = await this.employeeRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!employee.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      employee.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      employee: {
        id: employee.id,
        employee_code: employee.employee_code,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    };
  }
}
