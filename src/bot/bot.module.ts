import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { ExerciseModule } from '../exercise/exercise.module';
import { TargetModule } from '../target/target.module';

@Module({
  imports: [ExerciseModule, TargetModule],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
