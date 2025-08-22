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

  async getCursosByPeriodo(periodo: number) {
    const cursos = await this.prisma.cursos.findMany({
      where: { periodo_academico: periodo },
      select: {
        id_curso: true,
        nm_curso: true,
        periodo_academico: true,
      },
    });

    return {
      periodo,
      cursos,
    };
  }

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

  


  // 🔹 Nuevo método: obtener calificaciones por curso
  async getGradesByCourse(id_curso: number) {
    // Obtener cortes del curso
    const cortes = await this.prisma.cortes.findMany({
      where: { fk_curso: id_curso },
      orderBy: { numero_corte: 'asc' },
      select: { id_corte: true, numero_corte: true },
    });

    // Obtener inscripciones con estudiantes
    const inscripciones = await this.prisma.rel_Inscripciones.findMany({
      where: { fk_curso: id_curso },
      select: { id_inscripcion: true, fk_estudiante: true },
    });

    // Obtener calificaciones existentes
    const calificaciones = await this.prisma.calificaciones.findMany({
      where: { corte: { fk_curso: id_curso } },
      select: {
        id_calificacion: true,
        calificacion: true,
        corte: { select: { id_corte: true, numero_corte: true } },
        fk_inscripcion: true,
      },
    });

    // Armar respuesta
    const respuesta = {
      curso: id_curso,
      calificaciones: inscripciones.map((i) => ({
        fk_estudiante: i.fk_estudiante,
        cortes: cortes.map((c) => {
          const calif = calificaciones.find(
            (cal) =>
              cal.corte.id_corte === c.id_corte &&
              cal.fk_inscripcion === i.id_inscripcion
          );
          return {
            fk_corte: c.id_corte,
            numero_corte: c.numero_corte,
            calificacion: calif ? calif.calificacion : null,
          };
        }),
      })),
    };

    return respuesta;
  }

  

 async getCoursesByPeriodo(periodo: number) {

  periodo = Number(periodo);
  const cursos = await this.prisma.cursos.findMany({
    where: { periodo_academico: periodo },
    select: {
      id_curso: true,
      nm_curso: true,
    },
  });

  return {
    periodo,
    cursos,
  };
}





  async getStudentsByCourse(id_curso) {
  // Obtener cortes del curso (con %)

  id_curso = Number(id_curso);
  const cortes = await this.prisma.cortes.findMany({
    where: { fk_curso: id_curso },
    orderBy: { numero_corte: 'asc' },
    select: { id_corte: true, numero_corte: true, porcentaje: true },
  });

  // Obtener inscripciones con datos del estudiante
  const inscripciones = await this.prisma.rel_Inscripciones.findMany({
    where: { fk_curso: id_curso },
    select: {
      id_inscripcion: true,
      estudiante: {
        select: {
          id_estudiante: true,
          nombre: true,
          apellido: true,
        },
      },
    },
  });

  // Obtener calificaciones existentes
  const calificaciones = await this.prisma.calificaciones.findMany({
    where: { corte: { fk_curso: id_curso } },
    select: {
      calificacion: true,
      fk_inscripcion: true,
      corte: { select: { id_corte: true, numero_corte: true } },
    },
  });

  // Respuesta
  const respuesta = {
    id_curso,
    estudiantes: inscripciones.map((i) => ({
      id_estudiante: i.estudiante.id_estudiante,
      nombre: i.estudiante.nombre,
      apellido: i.estudiante.apellido,
      calificaciones: cortes.map((c) => {
        const calif = calificaciones.find(
          (cal) =>
            cal.corte.id_corte === c.id_corte &&
            cal.fk_inscripcion === i.id_inscripcion
        );
        return {
          numero_corte: c.numero_corte,
          porcentaje: c.porcentaje,
          calificacion: calif ? calif.calificacion : null,
        };
      }),
    })),
  };

  return respuesta;
}

}
