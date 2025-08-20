import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateGradeDto {
  @IsInt()
  id_estudiante: number;

  @IsInt()
  id_curso: number;

  @IsInt()
  id_corte: number;

  @IsNumber()
  @Min(0)
  @Max(5) 
  calificacion: number;
}