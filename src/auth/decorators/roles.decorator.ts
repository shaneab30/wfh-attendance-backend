import { SetMetadata } from '@nestjs/common';
import { EmployeeRole } from '../../employees/employees.entity';

export const Roles = (...roles: EmployeeRole[]) => SetMetadata('roles', roles);
