import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmployeesService } from '../employees/employees.service';
import { EmployeeRole } from 'src/employees/employees.entity';
// import { EmployeeRole } from '../employees/employees.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeesService = app.get(EmployeesService);

  try {
    // Create Admin
    console.log('Creating Admin user...');
    const admin = await employeesService.create({
      employee_code: 'ADMIN001',
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123',
      role: EmployeeRole.ADMIN,
    });
    console.log('✅ Admin created:', admin);

    // Create HRD
    console.log('\nCreating HRD user...');
    const hrd = await employeesService.create({
      employee_code: 'HRD001',
      name: 'HRD Manager',
      email: 'hrd@company.com',
      password: 'hrd123',
      role: EmployeeRole.HRD,
    });
    console.log('✅ HRD created:', hrd);

    // Create Employee
    console.log('\nCreating Employee user...');
    const employee = await employeesService.create({
      employee_code: 'EMP001',
      name: 'Employee User',
      email: 'employee@company.com',
      password: 'employee123',
      role: EmployeeRole.EMPLOYEE,
    });
    console.log('✅ Employee created:', employee);

    console.log('\n=== Login Credentials ===');
    console.log('Admin:');
    console.log('  Email: admin@company.com');
    console.log('  Password: admin123');
    console.log('\nHRD:');
    console.log('  Email: hrd@company.com');
    console.log('  Password: hrd123');
    console.log('========================\n');
    console.log('Employee:');
    console.log('  Email: employee@company.com');
    console.log('  Password: employee123');
    console.log('========================\n');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error('❌ Error creating users:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
