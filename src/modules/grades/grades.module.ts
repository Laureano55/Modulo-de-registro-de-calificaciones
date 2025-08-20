import { Module } from '@nestjs/common';
import { GradesController } from './controllers/grades/grades.controller';
import { GradesService } from './services/grades/grades.service';

@Module({
  controllers: [GradesController],
  providers: [GradesService]
})
export class GradesModule {}
