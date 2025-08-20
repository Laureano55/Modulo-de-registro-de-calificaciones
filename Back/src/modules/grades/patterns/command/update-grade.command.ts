import { Command } from './command.interface';
import { CalificacionBuilder } from '../builder/calificacion.builder';
import { CalificacionData } from '../builder/calificacion-builder.interface';

export class UpdateGradeCommand implements Command<CalificacionData> {
  constructor(
    private builder: CalificacionBuilder,
    private existing: CalificacionData, // la calificación que ya existe
    private updates: Partial<CalificacionData> // lo que quieres cambiar
  ) {}

  execute(): CalificacionData {
    // reconstruimos usando el builder
    this.builder
      .setInscripcionId(this.updates.fk_inscripcion ?? this.existing.fk_inscripcion)
      .setCorteId(this.updates.fk_corte ?? this.existing.fk_corte)
      .setCalificacion(this.updates.calificacion ?? this.existing.calificacion)
      .setFechaRegistro(this.updates.dt_registro ?? this.existing.dt_registro);

    return this.builder.build();
  }
}
