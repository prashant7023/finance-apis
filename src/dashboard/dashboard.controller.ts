import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client/index';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@ApiSecurity('x-user-id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('categories')
  getCategoryBreakdown() {
    return this.dashboardService.getCategoryBreakdown();
  }

  @Get('trends')
  @Roles(Role.ANALYST, Role.ADMIN)
  getMonthlyTrends(@Query('year') year = new Date().getFullYear().toString()) {
    const parsedYear = Number.parseInt(year, 10);
    const currentYear = new Date().getFullYear();

    if (Number.isNaN(parsedYear) || parsedYear < 1970 || parsedYear > currentYear + 1) {
      throw new BadRequestException('year must be a valid value between 1970 and next year');
    }

    return this.dashboardService.getMonthlyTrends(parsedYear);
  }

  @Get('recent')
  getRecentActivity(@Query('limit') limit = '10') {
    const parsedLimit = Number.parseInt(limit, 10);
    const safeLimit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;
    return this.dashboardService.getRecentActivity(safeLimit);
  }
}

