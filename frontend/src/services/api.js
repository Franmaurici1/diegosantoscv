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

  // Document Request endpoints
  async getDocumentRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/DocumentRequests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch document requests: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getDocumentRequests error:', error);
      throw error;
    }
  },

  async getDocumentRequestsByProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/DocumentRequests/project/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch document requests: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getDocumentRequestsByProject error:', error);
      throw error;
    }
  },

  async createDocumentRequest(documentRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/DocumentRequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentRequest),
      });
      if (!response.ok) {
        throw new Error(`Failed to create document request: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('createDocumentRequest error:', error);
      throw error;
    }
  },

  async updateDocumentRequest(id, documentRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/DocumentRequests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentRequest),
      });
      if (!response.ok) {
        throw new Error(`Failed to update document request: ${response.status} ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error('updateDocumentRequest error:', error);
      throw error;
    }
  },

  async getDocumentRequest(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/DocumentRequests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch document request: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getDocumentRequest error:', error);
      throw error;
    }
  },

  // Form Response endpoints
  async getFormResponses() {
    try {
      const response = await fetch(`${API_BASE_URL}/FormResponses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch form responses: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getFormResponses error:', error);
      throw error;
    }
  },

  async getFormResponsesByRequest(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/FormResponses/request/${requestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch form responses: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getFormResponsesByRequest error:', error);
      throw error;
    }
  },

  async submitFormResponse(formResponse) {
    try {
      const response = await fetch(`${API_BASE_URL}/FormResponses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formResponse),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit form response: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('submitFormResponse error:', error);
      throw error;
    }
  },

  async submitFormResponsesBatch(formResponses) {
    try {
      const response = await fetch(`${API_BASE_URL}/FormResponses/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formResponses),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit form responses: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('submitFormResponsesBatch error:', error);
      throw error;
    }
  },

  async updateFormResponse(id, formResponse) {
    try {
      const response = await fetch(`${API_BASE_URL}/FormResponses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formResponse),
      });
      if (!response.ok) {
        throw new Error(`Failed to update form response: ${response.status} ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error('updateFormResponse error:', error);
      throw error;
    }
  },
};

