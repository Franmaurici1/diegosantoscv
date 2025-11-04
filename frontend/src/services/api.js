// Update this URL to match your backend port (check the console when running dotnet run)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5168/api';

export const api = {
  // CV Info endpoints
  async getCvInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/CvInfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null; // CV info doesn't exist yet
        }
        throw new Error(`Failed to fetch CV info: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getCvInfo error:', error);
      throw error;
    }
  },

  // Projects endpoints
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/Projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  async getProject(id) {
    const response = await fetch(`${API_BASE_URL}/Projects/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return response.json();
  },

  // Work Experience endpoints
  async getWorkExperiences() {
    try {
      const response = await fetch(`${API_BASE_URL}/WorkExperiences`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch work experiences: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getWorkExperiences error:', error);
      throw error;
    }
  },

  // Skills endpoints
  async getSkills() {
    try {
      const response = await fetch(`${API_BASE_URL}/Skills`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getSkills error:', error);
      throw error;
    }
  },

  // Education endpoints
  async getEducations() {
    try {
      const response = await fetch(`${API_BASE_URL}/Educations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch educations: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getEducations error:', error);
      throw error;
    }
  },
};

