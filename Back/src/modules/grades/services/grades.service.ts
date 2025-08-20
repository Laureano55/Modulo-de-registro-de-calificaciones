import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CalificacionBuilder } from '../patterns/builder/calificacion.builder';

@Injectable()
export class GradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calificacionBuilder: CalificacionBuilder,
  ) {}


  async createGrade(
    id_estudiante: number,
    id_curso: number,
    id_corte: number,
    calificacion: number,
    ) {
    // Crea inscripción
    const inscripcion = await this.prisma.rel_Inscripciones.create({
        data: {
        fk_estudiante: id_estudiante,
        fk_curso: id_curso,
        },
        select: { id_inscripcion: true },
    });

    // Construye calificación con el builder
    const calificacionData = this.calificacionBuilder
        .setInscripcionId(inscripcion.id_inscripcion)
        .setCorteId(id_corte)
        .setCalificacion(calificacion)
        .setFechaRegistro()
        .build();

    // Guarda calificación
    return this.prisma.calificaciones.create({
        data: calificacionData,
    });
 }



  async getCoursesByPeriodo(periodo: number) {
    return;
  }

  async getStudentsByCourse(id_curso: number) {
    return;
  }
}
