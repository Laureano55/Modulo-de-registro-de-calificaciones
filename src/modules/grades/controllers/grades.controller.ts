import { Controller, Post, Body } from '@nestjs/common';
import { GradesService } from '../services/grades.service';
import { CreateGradeDto } from '../dto/create-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  async createGrade(@Body() createGradeDto: CreateGradeDto) {
    const { id_estudiante, id_curso, id_corte, calificacion } = createGradeDto;
    return this.gradesService.createGrade(
      id_estudiante,
      id_curso,
      id_corte,
      calificacion,
    );
  }
}