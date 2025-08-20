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
        // Buscar fk_corte real usando numero_corte + fk_curso
        const corteReal = await this.prisma.cortes.findFirst({
          where: {
            fk_curso: curso,
            numero_corte: corte.numero_corte,
          },
          select: { id_corte: true },
        });

        if (!corteReal) {
          throw new Error(
            `No se encontró corte número ${corte.numero_corte} para el curso ${curso}`
          );
        }

        const calificacionData = this.calificacionBuilder
          .setInscripcionId(inscripcion.id_inscripcion)
          .setCorteId(corteReal.id_corte) // ahora usamos el fk_corte real
          .setCalificacion(corte.calificacion)
          .setFechaRegistro()
          .build();

        const idCalificacion = Math.floor(Math.random() * 2000000000);
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
