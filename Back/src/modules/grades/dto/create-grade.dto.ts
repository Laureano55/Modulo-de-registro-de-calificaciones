import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateGradesDto {
  curso: number;
  calificaciones: {
    fk_estudiante: number;
    cortes: { fk_corte: number; calificacion: number | null }[];
  }[];
}