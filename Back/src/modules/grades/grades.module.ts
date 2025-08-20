import { Module } from '@nestjs/common';
import { GradesController } from './controllers/grades.controller';
import { GradesService } from './services/grades.service';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { CalificacionBuilder } from './patterns/builder/calificacion.builder';
@Module({
  imports: [PrismaModule], 
  controllers: [GradesController],
  providers: [GradesService, CalificacionBuilder],
})
export class GradesModule {}