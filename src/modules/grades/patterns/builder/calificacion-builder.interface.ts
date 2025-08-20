export interface ICalificacionBuilder {
  setInscripcionId(inscripcionId: number): ICalificacionBuilder;
  setCorteId(corteId: number): ICalificacionBuilder;
  setCalificacion(calificacion: number): ICalificacionBuilder;
  setFechaRegistro(fechaRegistro?: Date): ICalificacionBuilder;
  build(): CalificacionData;
}

export interface CalificacionData {
  fk_inscripcion: number;
  fk_corte: number;
  calificacion: number;
  dt_registro: Date;
}
