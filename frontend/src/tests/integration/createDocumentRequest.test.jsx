import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DocumentRequest from '../../components/DocumentRequest';
import { api } from '../../services/api';

// Mock the API module
vi.mock('../../services/api', () => ({
  api: {
    createDocumentRequest: vi.fn(),
    getProject: vi.fn(),
  },
}));

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={['/project-code/1']}>
      <Routes>
        <Route path="/project-code/:id" element={<DocumentRequest />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('createDocumentRequest Integration Test', () => {
  const mockDocumentRequest = {
    id: 123,
    projectId: 1,
    projectName: 'Alcott Academy',
    status: 'Draft',
    topics: [
      {
        id: 1,
        categoryName: 'General',
        topicName: 'Personnel Data',
        topicLabel: 'Personnel',
        description: 'HR Data - Employee census and payroll information',
        priority: 'Priority',
        isSelected: true,
        hasFieldRequirements: false,
        fields: [],
      },
    ],
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    api.getProject.mockResolvedValue({ id: 1, title: 'Test Project' });
    api.createDocumentRequest.mockResolvedValue(mockDocumentRequest);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully create a document request with selected topics', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // The component has mock data with pre-selected topics (Contingent Labor is selected by default)
    // Click the "Create request" button
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Verify API was called
    await waitFor(() => {
      expect(api.createDocumentRequest).toHaveBeenCalledTimes(1);
    });

    const apiCallArgs = api.createDocumentRequest.mock.calls[0][0];

    // Verify the structure of the request
    expect(apiCallArgs).toHaveProperty('projectId', 1);
    expect(apiCallArgs).toHaveProperty('projectName');
    expect(apiCallArgs).toHaveProperty('status', 'Draft');
    expect(apiCallArgs).toHaveProperty('topics');
    expect(Array.isArray(apiCallArgs.topics)).toBe(true);
    expect(apiCallArgs.topics.length).toBeGreaterThan(0);

    // Verify topic structure
    const firstTopic = apiCallArgs.topics[0];
    expect(firstTopic).toHaveProperty('categoryName');
    expect(firstTopic).toHaveProperty('topicName');
    expect(firstTopic).toHaveProperty('topicLabel');
    expect(firstTopic).toHaveProperty('description');
    expect(firstTopic).toHaveProperty('priority');
    expect(firstTopic).toHaveProperty('isSelected', true);
    expect(firstTopic).toHaveProperty('hasFieldRequirements');
    expect(firstTopic).toHaveProperty('fields');

    // Verify success modal appears
    await waitFor(() => {
      expect(screen.getByText(/Request Created Successfully/i)).toBeInTheDocument();
    });
  });

  it('should show alert when trying to create request without selecting topics', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // First, uncheck ALL pre-selected topics
    const checkboxes = screen.getAllByRole('checkbox');
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        await user.click(checkbox);
      }
    }

    // Click "Create request" without selecting any topics
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Verify alert was shown
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Please select at least one topic before creating a request'
      );
    });

    // Verify API was NOT called
    expect(api.createDocumentRequest).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock API to throw an error
    const errorMessage = 'Failed to create document request: 500 Internal Server Error';
    api.createDocumentRequest.mockRejectedValue(new Error(errorMessage));

    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click "Create request" (Contingent Labor is pre-selected)
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Verify error alert is shown
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create request')
      );
    });

    // Verify success modal does NOT appear
    expect(screen.queryByText(/Request Created Successfully/i)).not.toBeInTheDocument();

    alertSpy.mockRestore();
  });

  it('should display success modal after creating request', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click "Create request" (Contingent Labor is pre-selected)
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Verify success modal appears and contains action buttons
    await waitFor(() => {
      expect(screen.getByText(/Request Created Successfully/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /View Form/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Go to Forms List/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Another/i })).toBeInTheDocument();
    });
  });

  it('should include all selected topics in the request', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Select multiple topics
    const allCheckboxes = screen.getAllByRole('checkbox');
    // Click first checkbox (if not already selected)
    if (!allCheckboxes[0].checked) {
      await user.click(allCheckboxes[0]);
    }
    // Click second checkbox if exists
    if (allCheckboxes.length > 1 && !allCheckboxes[1].checked) {
      await user.click(allCheckboxes[1]);
    }

    // Click "Create request"
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Verify API was called
    await waitFor(() => {
      expect(api.createDocumentRequest).toHaveBeenCalledTimes(1);
    });

    const apiCallArgs = api.createDocumentRequest.mock.calls[0][0];

    // Verify all topics in the request are selected
    expect(apiCallArgs.topics.length).toBeGreaterThan(0);
    apiCallArgs.topics.forEach(topic => {
      expect(topic.isSelected).toBe(true);
    });
  });

  it('should pass correct project information to API', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click "Create request" (Contingent Labor is pre-selected)
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Verify project information is correct
    await waitFor(() => {
      expect(api.createDocumentRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 1,
          projectName: expect.any(String), // The mock data uses 'Alcott Academy' by default
        })
      );
    });
  });

  it('should have navigation buttons in success modal', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click "Create request" (Contingent Labor is pre-selected)
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    // Wait for success modal and verify navigation buttons are present
    await waitFor(() => {
      expect(screen.getByText(/Request Created Successfully/i)).toBeInTheDocument();
    });

    // Verify all navigation buttons are present and accessible
    const viewFormButton = screen.getByRole('button', { name: /View Form/i });
    const goToFormsButton = screen.getByRole('button', { name: /Go to Forms List/i });
    const createAnotherButton = screen.getByRole('button', { name: /Create Another/i });

    expect(viewFormButton).toBeInTheDocument();
    expect(goToFormsButton).toBeInTheDocument();
    expect(createAnotherButton).toBeInTheDocument();
  });

  it('should verify API request payload structure matches backend expectations', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click "Create request" (Contingent Labor is pre-selected)
    const createButton = screen.getByRole('button', { name: /Create request/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(api.createDocumentRequest).toHaveBeenCalled();
    });

    const payload = api.createDocumentRequest.mock.calls[0][0];

    // Verify payload matches DocumentRequest C# model expectations
    expect(payload).toMatchObject({
      projectId: expect.any(Number),
      projectName: expect.any(String),
      status: 'Draft',
      topics: expect.arrayContaining([
        expect.objectContaining({
          categoryName: expect.any(String),
          topicName: expect.any(String),
          topicLabel: expect.any(String),
          description: expect.any(String),
          priority: expect.any(String),
          isSelected: true,
          hasFieldRequirements: expect.any(Boolean),
          fields: expect.any(Array),
        }),
      ]),
    });
  });
});
