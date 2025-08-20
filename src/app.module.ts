import { Module } from '@nestjs/common';
import { GradesModule } from './modules/grades/grades.module';


@Module({
  imports: [GradesModule]
})
export class AppModule {}
