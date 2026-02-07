import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { ExerciseModule } from './exercise/exercise.module';
import { TargetModule } from './target/target.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   // 👈 خیلی مهم
    }),
    BotModule,
    ExerciseModule,
    TargetModule,
  ],
})
export class AppModule {}
