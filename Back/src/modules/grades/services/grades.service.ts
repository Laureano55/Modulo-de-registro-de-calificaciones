import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CalificacionBuilder } from '../patterns/builder/calificacion.builder';
import { CreateGradesDto } from '../dto/create-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calificacionBuilder: CalificacionBuilder,
  ) {}


  async createGradesBatch(dto: CreateGradesDto) {
    const { curso, calificaciones } = dto;
    const results: any[] = [];

    for (const estudiante of calificaciones) {
      let inscripcion = await this.prisma.rel_Inscripciones.findFirst({
        where: { fk_estudiante: estudiante.fk_estudiante, fk_curso: curso },
        select: { id_inscripcion: true },
      });

      if (!inscripcion) {

        const idManual = Math.floor(Math.random() * 2000000000);

        inscripcion = await this.prisma.rel_Inscripciones.create({
          data: { 
            id_inscripcion: idManual,  
            fk_estudiante: estudiante.fk_estudiante, 
            fk_curso: curso 
          },
          select: { id_inscripcion: true },
        });
      }

      for (const corte of estudiante.cortes) {
        if (corte.calificacion !== null) {
          // Generar un ID único para la calificación
          const idCalificacion = Math.floor(Math.random() * 2000000000);

          const calificacionData = this.calificacionBuilder
            .setInscripcionId(inscripcion.id_inscripcion)
            .setCorteId(corte.fk_corte)
            .setCalificacion(corte.calificacion)
            .setFechaRegistro()
            .build();

          // Asignamos el ID manual
          const result = await this.prisma.calificaciones.create({
            data: { id_calificacion: idCalificacion, ...calificacionData },
          });

          results.push(result);
        }
      }
    }

    return results;
  }



  async getCoursesByPeriodo(periodo: number) {
    return;
  }

  async getStudentsByCourse(id_curso: number) {
    return;
  }
}
