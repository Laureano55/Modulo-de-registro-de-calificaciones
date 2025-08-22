import { Controller, Post, Body } from '@nestjs/common';
import { CoursesService } from '../services/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('by-period')
  async getByPeriod(@Body() body: { periodId: number }) {
    return this.coursesService.getByPeriod(body.periodId);
  }
}