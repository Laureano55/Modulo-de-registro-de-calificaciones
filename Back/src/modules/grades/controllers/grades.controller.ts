import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { GradesService } from '../services/grades.service';
import { CreateGradesDto } from '../dto/create-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('batch')
  async createGradesBatch(@Body() createGradesDto: CreateGradesDto) {
    return this.gradesService.createGradesBatch(createGradesDto);
  }

  // Nuevo endpoint: obtener cursos por período
  @Get('cursos')
  async getCoursesByPeriodo(@Query('periodo') periodo: number) {
    return this.gradesService.getCoursesByPeriodo(periodo);
  }

  @Get('estudiantes')
  async getStudentsByCourse(@Query('id_curso') id_curso: number) {
    return this.gradesService.getStudentsByCourse(id_curso);
  }

}
