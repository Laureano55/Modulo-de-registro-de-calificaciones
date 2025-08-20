// create-grade.command.ts
import { Command } from './command.interface';
import { CalificacionBuilder } from '../builder/calificacion.builder';
import { CalificacionData } from '../builder/calificacion-builder.interface';

export class CreateGradeCommand implements Command<CalificacionData> {
  constructor(
    private builder: CalificacionBuilder,
    private data: { fk_inscripcion: number; fk_corte: number; calificacion: number; fecha?: Date }
  ) {}

  execute(): CalificacionData {
    return this.builder
      .setInscripcionId(this.data.fk_inscripcion)
      .setCorteId(this.data.fk_corte)
      .setCalificacion(this.data.calificacion)
      .setFechaRegistro(this.data.fecha)
      .build();
  }
}

