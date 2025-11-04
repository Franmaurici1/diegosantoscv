import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './DocumentRequest.css';

function DocumentRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('REQUEST');
  const [selectedProject, setSelectedProject] = useState('Alcott Academy');
  const [filterMode, setFilterMode] = useState('all');
  const [topics, setTopics] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState(null);

  // Mock data for projects
  const mockProjects = [
    'Alcott Academy',
    'Bradwell Institute',
    'Stanford University',
    'Northgate Academy',
    'Massachusetts Institute of Technology',
    'Oakwood School'
  ];

  // Mock data for document request topics
  const mockTopics = [
    {
      id: 1,
      category: 'General',
      name: 'Personnel Data',
      label: 'Personnel',
      description: 'HR Data - Employee census and payroll information, see field requirement for more detail',
      priority: 'Priority',
      isSelected: false,
      hasFieldRequirements: false
    },
    {
      id: 2,
      category: 'General',
      name: 'Contingent Labor',
      label: 'Labor',
      description: 'Independent contractors HR data, see field requirement for more detail',
      priority: 'Tier 2',
      isSelected: true,
      hasFieldRequirements: true
    },
    {
      id: 3,
      category: 'General',
      name: 'Open Positions',
      label: 'Openings',
      description: 'Open positions list see field requirement for more details',
      priority: 'Priority',
      isSelected: false,
      hasFieldRequirements: false
    },
    {
      id: 4,
      category: 'Human Resources',
      name: 'Vendor Spend for Service Providers KPIs',
      label: 'VendorSpendKPI',
      description: 'Vendor spend for HR services (recruiting, outsourced HR functions and processes, IT)',
      priority: 'Priority',
      isSelected: false,
      hasFieldRequirements: false
    },
    {
      id: 5,
      category: 'Human Resources',
      name: 'Recruiting Service Providers',
      label: 'Recruiting Ext',
      description: 'Recruiting & staffing vendors utilized by function, annual placements, costs & standard pricing agreements. Other outsourced vendors used for payroll, benefits, training etc.',
      priority: 'Tier 3',
      isSelected: true,
      hasFieldRequirements: true
    },
    {
      id: 6,
      category: 'Human Resources',
      name: 'HR workflows',
      label: 'HR',
      description: 'Vendor spend for HR services (recruiting, outsourced HR functions and processes, IT)',
      priority: 'Tier 2',
      isSelected: true,
      hasFieldRequirements: true
    },
    {
      id: 7,
      category: 'Financial Reports',
      name: 'FY25 Plan',
      label: 'FY25',
      description: 'Budget & YTD, at the lowest level of detail (by cost center, be department, spend type)',
      priority: 'Tier 3',
      isSelected: true,
      hasFieldRequirements: true
    },
    {
      id: 8,
      category: 'Financial Reports',
      name: 'Technology Capital Expense Detail',
      label: 'Tech Expense Det',
      description: 'Technology capex spending by location/category (actual v budget) for past 3 years, and 3 year capex plan',
      priority: 'Tier 1',
      isSelected: true,
      hasFieldRequirements: true
    },
    {
      id: 9,
      category: 'Financial Reports',
      name: 'Chart of Accounts',
      label: 'Acc Chart',
      description: 'Complete chart of accounts with descriptions',
      priority: 'Priority',
      isSelected: false,
      hasFieldRequirements: false
    },
    {
      id: 10,
      category: '3rd party vendor',
      name: 'Vendor List',
      label: 'Vendors',
      description: 'List of all vendors with contact information',
      priority: 'Priority',
      isSelected: false,
      hasFieldRequirements: false
    },
    {
      id: 11,
      category: 'Other files',
      name: 'Organizational Charts',
      label: 'Org Charts',
      description: 'Current organizational structure diagrams',
      priority: 'Tier 1',
      isSelected: false,
      hasFieldRequirements: false
    }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id && id !== 'new') {
          const data = await api.getProject(id);
          setProject(data);
          setSelectedProject(data.title || 'Alcott Academy');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    setTopics(mockTopics);
  }, [id]);

  const handleTopicToggle = (topicId) => {
    setTopics(topics.map(topic =>
      topic.id === topicId ? { ...topic, isSelected: !topic.isSelected } : topic
    ));
  };

  const handlePriorityChange = (topicId, newPriority) => {
    setTopics(topics.map(topic =>
      topic.id === topicId ? { ...topic, priority: newPriority } : topic
    ));
  };

  const getFilteredTopics = () => {
    if (filterMode === 'selected') {
      return topics.filter(t => t.isSelected);
    }
    if (filterMode === 'non-selected') {
      return topics.filter(t => !t.isSelected);
    }
    return topics;
  };

  const getTopicsByCategory = () => {
    const filtered = getFilteredTopics();
    const categories = {};
    filtered.forEach(topic => {
      if (!categories[topic.category]) {
        categories[topic.category] = [];
      }
      categories[topic.category].push(topic);
    });
    return categories;
  };

  const selectedCount = topics.filter(t => t.isSelected).length;
  const totalCount = topics.length;

  const handleCreateRequest = async () => {
    try {
      const selectedTopics = topics.filter(t => t.isSelected);

      if (selectedTopics.length === 0) {
        alert('Please select at least one topic before creating a request');
        return;
      }

      const documentRequest = {
        projectId: parseInt(id),
        projectName: selectedProject,
        status: 'Draft',
        topics: selectedTopics.map(topic => ({
          categoryName: topic.category,
          topicName: topic.name,
          topicLabel: topic.label,
          description: topic.description,
          priority: topic.priority,
          isSelected: topic.isSelected,
          hasFieldRequirements: topic.hasFieldRequirements,
          fields: []
        }))
      };

      const response = await api.createDocumentRequest(documentRequest);
      setCreatedRequestId(response.id);
      setShowSuccessModal(true);
    } catch (err) {
      alert('Failed to create request: ' + err.message);
    }
  };

  if (loading) {
    return <div className="document-request-loading">Loading...</div>;
  }

  if (error) {
    return <div className="document-request-error">Error: {error}</div>;
  }

  return (
    <div className="document-request">
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-modal-icon">✓</div>
            <h2>Request Created Successfully!</h2>
            <p>Your document request has been created and is ready to share.</p>
            <div className="success-modal-actions">
              <button
                className="modal-btn modal-btn-primary"
                onClick={() => navigate(`/form/${createdRequestId}`)}
              >
                View Form
              </button>
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => navigate('/forms')}
              >
                Go to Forms List
              </button>
              <button
                className="modal-btn modal-btn-tertiary"
                onClick={() => setShowSuccessModal(false)}
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="document-request-header">
        <div className="header-brand">
          <div className="brand-icon">A</div>
          <div className="brand-name">AlixVault - {selectedProject}</div>
        </div>
      </header>

      <div className="document-request-container">
        <div className="project-selector-section">
          <label className="project-label">Project</label>
          <div className="project-dropdown-wrapper">
            <select
              className="project-dropdown"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {mockProjects.map((proj, index) => (
                <option key={index} value={proj}>{proj}</option>
              ))}
            </select>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'REQUEST' ? 'active' : ''}`}
            onClick={() => setActiveTab('REQUEST')}
          >
            REQUEST
          </button>
          <button
            className={`tab ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
            onClick={() => setActiveTab('OVERVIEW')}
          >
            OVERVIEW
          </button>
          <button
            className={`tab ${activeTab === 'PROJECT FILES' ? 'active' : ''}`}
            onClick={() => setActiveTab('PROJECT FILES')}
          >
            PROJECT FILES
          </button>
        </div>

        <div className="content-layout">
          <aside className="sidebar">
            <div className="sidebar-header">
              <h3>Categories</h3>
              <button className="add-button">+ ADD</button>
            </div>
            <ul className="category-list">
              <li className="category-item active">General</li>
              <li className="category-item">Human resources</li>
              <li className="category-item">Financial reports</li>
              <li className="category-item">3rd party vendor</li>
              <li className="category-item">Other files</li>
            </ul>
          </aside>

          <main className="main-content">
            <div className="request-header">
              <h2>Request for information</h2>
              <div className="header-actions">
                <span className="auto-save-notice">Changes are automatically saved</span>
                <button className="create-request-btn" onClick={handleCreateRequest}>
                  Create request
                </button>
              </div>
            </div>

            <div className="info-banner">
              <span className="info-icon">ℹ️</span>
              <span>You can select and prioritize topics, review and edit their fields if applicable, and add new categories or topics as needed.</span>
            </div>

            <div className="topics-controls">
              <div className="filter-dropdown-wrapper">
                <select
                  className="filter-dropdown"
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                >
                  <option value="all">View all topics</option>
                  <option value="selected">View selected topics</option>
                  <option value="non-selected">View non-selected topics</option>
                </select>
                <span className="dropdown-arrow-small">▼</span>
              </div>
              <div className="selected-count">Selected Topics: {selectedCount}/{totalCount}</div>
              <button className="export-button">📊 Export to excel</button>
            </div>

            {Object.entries(getTopicsByCategory()).map(([category, categoryTopics]) => (
              <div key={category} className="category-section">
                <div className="category-header">
                  <h3>{category}</h3>
                  <button className="edit-icon">✏️</button>
                </div>

                <div className="topics-list">
                  {categoryTopics.map(topic => (
                    <div key={topic.id} className="topic-item">
                      <div className="topic-checkbox">
                        <input
                          type="checkbox"
                          checked={topic.isSelected}
                          onChange={() => handleTopicToggle(topic.id)}
                          id={`topic-${topic.id}`}
                        />
                      </div>
                      <div className="topic-details">
                        <div className="topic-name">
                          <label htmlFor={`topic-${topic.id}`}>
                            <strong>{topic.name}</strong> <span className="topic-label">{topic.label}</span>
                          </label>
                        </div>
                        <div className="topic-description">{topic.description}</div>
                      </div>
                      {topic.hasFieldRequirements && (
                        <button className="review-fields-btn">
                          <span className="info-circle">ℹ️</span> Review fields
                        </button>
                      )}
                      <div className="topic-priority">
                        <label>Priority</label>
                        <div className="priority-dropdown-wrapper">
                          <select
                            className={`priority-dropdown priority-${topic.priority.toLowerCase().replace(' ', '-')}`}
                            value={topic.priority}
                            onChange={(e) => handlePriorityChange(topic.id, e.target.value)}
                          >
                            <option value="Priority">Priority</option>
                            <option value="Tier 1">Tier 1</option>
                            <option value="Tier 2">Tier 2</option>
                            <option value="Tier 3">Tier 3</option>
                          </select>
                          <span className="dropdown-arrow-tiny">▼</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DocumentRequest;
