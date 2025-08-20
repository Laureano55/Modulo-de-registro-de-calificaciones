import { Module } from '@nestjs/common';
import { GradesController } from './controllers/grades.controller';
import { GradesService } from './services/grades.service';

@Module({
  controllers: [GradesController],
  providers: [GradesService]
})
export class GradesModule {}
