import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GradesService } from '../services/grades.service';
import { CreateGradesDto } from '../dto/create-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('batch')
  async createGradesBatch(@Body() createGradesDto: CreateGradesDto) {
    return this.gradesService.createGradesBatch(createGradesDto);
  }

  // 🔹 Nuevo endpoint: obtener calificaciones por curso
  @Get('curso/:id')
  async getGradesByCourse(@Param('id', ParseIntPipe) id: number) {
    return this.gradesService.getGradesByCourse(id);
  }
}
