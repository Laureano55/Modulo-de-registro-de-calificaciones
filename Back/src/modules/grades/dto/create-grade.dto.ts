import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateGradesDto {
  curso: number;
  calificaciones: {
    fk_estudiante: number;
    cortes: { numero_corte: number; calificacion: number | null }[];
  }[];
}