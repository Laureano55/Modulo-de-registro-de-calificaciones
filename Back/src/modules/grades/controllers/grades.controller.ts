import { Controller, Post, Body } from '@nestjs/common';
import { GradesService } from '../services/grades.service';
import { CreateGradesDto } from '../dto/create-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('batch')
  async createGradesBatch(@Body() createGradesDto: CreateGradesDto) {
    return this.gradesService.createGradesBatch(createGradesDto);
  }
}