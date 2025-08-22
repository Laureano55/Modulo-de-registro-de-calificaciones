import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {
  // Simulación de cursos, después lo conectas a tu BD
  private courses = [
    { id: 10, name: 'Cálculo Diferencial', periodId: 202510 },
    { id: 11, name: 'Programación I', periodId: 202510 },
    { id: 12, name: 'Álgebra Lineal', periodId: 202510 },
    { id: 20, name: 'Estructuras de Datos', periodId: 202520 },
  ];

  getByPeriod(periodId: number) {
    return this.courses.filter(curso => curso.periodId === periodId);
  }
}