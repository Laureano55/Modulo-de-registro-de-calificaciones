import { Module } from '@nestjs/common';
import { GradesController } from './controllers/grades.controller';
import { GradesService } from './services/grades.service';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { CalificacionBuilder } from './patterns/builder/calificacion.builder';
@Module({
  imports: [PrismaModule], // <- aquí es donde importa PrismaModule
  controllers: [GradesController],
  providers: [GradesService, CalificacionBuilder], // <- agrega el builder si lo necesitas
})
export class GradesModule {}