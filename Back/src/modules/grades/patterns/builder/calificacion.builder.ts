import { Injectable } from '@nestjs/common';
import { ICalificacionBuilder, CalificacionData } from './calificacion-builder.interface';

@Injectable()
export class CalificacionBuilder implements ICalificacionBuilder {
  private calificacionData: CalificacionData;

  constructor() {
    this.calificacionData = {
      fk_inscripcion: 0,
      fk_corte: 0,
      calificacion: 0,
      dt_registro: new Date(),
    };
  }

  setInscripcionId(inscripcionId: number): ICalificacionBuilder {
    this.calificacionData.fk_inscripcion = inscripcionId;
    return this;
  }

  setCorteId(corteId: number): ICalificacionBuilder {
    this.calificacionData.fk_corte = corteId;
    return this;
  }

  setCalificacion(calificacion: number): ICalificacionBuilder {
    this.calificacionData.calificacion = calificacion;
    return this;
  }

  setFechaRegistro(fechaRegistro?: Date): ICalificacionBuilder {
    this.calificacionData.dt_registro = fechaRegistro || new Date();
    return this;
  }

  build(): CalificacionData {
    return this.calificacionData;
  }
}