import { Module } from '@nestjs/common';
import { ExerciseClient } from './exercise.client';
import { ExerciseService } from './exercise.service';

@Module({
  providers: [ExerciseService, ExerciseClient],
  exports: [ExerciseService],
})
export class ExerciseModule {}
