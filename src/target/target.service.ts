import { Injectable } from '@nestjs/common';
import { TargetClient } from './target.client';

@Injectable()
export class TargetService {
  constructor(private readonly client: TargetClient) {}

  async getTargetList() {
    return await this.client.getTargetList();
  }

  async getExercisesByTarget(target: string) {
    return await this.client.getExercisesByTarget(target);
  }

  async getExerciseById(id: string) {
    return await this.client.getExerciseById(id);
  }
}
