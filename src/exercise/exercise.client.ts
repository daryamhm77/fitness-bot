import axios from 'axios';

export class ExerciseClient {
  async findByName(name: string) {
    const apiKey = process.env.RAPID_API_KEY;
    
    if (!apiKey) {
      throw new Error('RAPID_API_KEY is not defined in environment variables');
    }

    try {
      console.log(`🔑 Using API Key: ${apiKey.substring(0, 10)}...`);
      console.log(`🔍 Searching for: "${name}"`);
      
      // استفاده از endpoint name برای جستجوی مستقیم
      const res = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}`,
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

      console.log(`📦 API Response status: ${res.status}`);
      console.log(`📊 Total exercises received: ${res.data?.length || 0}`);

      if (res.data?.length > 0) {
        console.log(`📝 First exercise:`, res.data[0].name);
      }

      return res.data;
    } catch (error) {
      console.error('❌ Error fetching exercises:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
      throw error;
    }
  }
}
