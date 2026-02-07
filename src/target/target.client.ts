import axios from 'axios';

export class TargetClient {
  async getTargetList() {
    const apiKey = process.env.RAPID_API_KEY;

    if (!apiKey) {
      throw new Error('RAPID_API_KEY is not defined in environment variables');
    }

    try {
      const res = await axios.get(
        'https://exercisedb.p.rapidapi.com/exercises/targetList',
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error('Error fetching target list:', error.response?.data || error.message);
      throw error;
    }
  }

  async getExercisesByTarget(target: string) {
    const apiKey = process.env.RAPID_API_KEY;

    if (!apiKey) {
      throw new Error('RAPID_API_KEY is not defined in environment variables');
    }

    try {
      const res = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/target/${encodeURIComponent(target)}`,
        {
          params: {
            limit: 10,
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error('Error fetching exercises by target:', error.response?.data || error.message);
      throw error;
    }
  }

  async getExerciseById(id: string) {
    const apiKey = process.env.RAPID_API_KEY;

    if (!apiKey) {
      throw new Error('RAPID_API_KEY is not defined in environment variables');
    }

    try {
      const res = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error('Error fetching exercise by id:', error.response?.data || error.message);
      throw error;
    }
  }
}
