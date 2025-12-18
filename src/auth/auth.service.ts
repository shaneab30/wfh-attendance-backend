import { Injectable } from '@nestjs/common';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class AuthService {
  constructor(private readonly employeesService: EmployeesService) {}
}
