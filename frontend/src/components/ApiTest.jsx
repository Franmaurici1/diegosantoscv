// Temporary component to test API calls
import { useEffect } from 'react';
import { api } from '../services/api';

export default function ApiTest() {
  useEffect(() => {
    const testApi = async () => {
      console.log('=== API TEST START ===');
      console.log('API_BASE_URL:', import.meta.env.VITE_API_URL || 'http://localhost:5168/api');
      
      try {
        console.log('Testing Skills API...');
        const skills = await api.getSkills();
        console.log('Skills response:', skills);
        console.log('Skills count:', skills?.length);
      } catch (error) {
        console.error('Skills API ERROR:', error);
      }

      try {
        console.log('Testing Work Experiences API...');
        const workExp = await api.getWorkExperiences();
        console.log('Work Experiences response:', workExp);
        console.log('Work Experiences count:', workExp?.length);
      } catch (error) {
        console.error('Work Experiences API ERROR:', error);
      }

      try {
        console.log('Testing Educations API...');
        const educations = await api.getEducations();
        console.log('Educations response:', educations);
        console.log('Educations count:', educations?.length);
      } catch (error) {
        console.error('Educations API ERROR:', error);
      }
      
      console.log('=== API TEST END ===');
    };
    
    testApi();
  }, []);

  return null;
}

