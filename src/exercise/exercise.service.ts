import { Injectable } from '@nestjs/common';
import { ExerciseClient } from './exercise.client';

@Injectable()
export class ExerciseService {
  constructor(private readonly client: ExerciseClient) {}

  async getExercise(name: string) {
    const exercises = await this.client.findByName(name);
    console.log(`🔍 Searched for: "${name}"`);
    console.log(`📊 Found ${exercises?.length || 0} exercises`);
    if (exercises?.length > 0) {
      console.log(`✅ First result keys:`, Object.keys(exercises[0]));
      console.log(`✅ Full first result:`, JSON.stringify(exercises[0], null, 2));
    }
    return exercises?.[0] ?? null;
  }

  async getExercises(name: string) {
    const exercises = await this.client.findByName(name);
    console.log(`🔍 Searched for: "${name}"`);
    console.log(`📊 Found ${exercises?.length || 0} exercises`);
    return exercises ?? [];
  }
}
