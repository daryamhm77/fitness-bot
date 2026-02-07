import { Module } from '@nestjs/common';
import { TargetClient } from './target.client';
import { TargetService } from './target.service';

@Module({
  providers: [TargetService, TargetClient],
  exports: [TargetService],
})
export class TargetModule {}
