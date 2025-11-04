import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import * as XLSX from 'xlsx';
import './ClientForm.css';

function ClientForm() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [documentRequest, setDocumentRequest] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [existingResponses, setExistingResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const request = await api.getDocumentRequest(requestId);
        setDocumentRequest(request);

        // Try to fetch existing responses
        try {
          const responses = await api.getFormResponsesByRequest(requestId);
          setExistingResponses(responses);

          // Populate form with existing responses
          const responsesMap = {};
          responses.forEach(resp => {
            responsesMap[resp.requestTopicId] = resp.responseText;
          });
          setFormResponses(responsesMap);
        } catch (err) {
          // No existing responses, that's okay
          console.log('No existing responses found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchData();
    }
  }, [requestId]);

  const handleInputChange = (topicId, value) => {
    setFormResponses(prev => ({
      ...prev,
      [topicId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const responses = documentRequest.topics.map(topic => ({
        documentRequestId: parseInt(requestId),
        requestTopicId: topic.id,
        responseText: formResponses[topic.id] || ''
      }));

      await api.submitFormResponsesBatch(responses);
      setSuccessMessage('Form submitted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to submit form: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setSuccessMessage('Link copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleExportToExcel = () => {
    if (!documentRequest) return;

    // Prepare data for Excel
    const excelData = [];

    // Add header information
    excelData.push(['Document Request Form']);
    excelData.push(['Project Name:', documentRequest.projectName]);
    excelData.push(['Status:', documentRequest.status]);
    excelData.push(['Created Date:', new Date(documentRequest.createdAt).toLocaleDateString()]);
    excelData.push(['Request ID:', documentRequest.id]);
    excelData.push([]); // Empty row

    // Add topics and responses
    excelData.push(['#', 'Category', 'Topic Name', 'Label', 'Priority', 'Description', 'Response']);

    documentRequest.topics.forEach((topic, index) => {
      excelData.push([
        index + 1,
        topic.categoryName,
        topic.topicName,
        topic.topicLabel,
        topic.priority,
        topic.description,
        formResponses[topic.id] || '(No response provided)'
      ]);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },   // #
      { wch: 20 },  // Category
      { wch: 30 },  // Topic Name
      { wch: 15 },  // Label
      { wch: 12 },  // Priority
      { wch: 50 },  // Description
      { wch: 50 }   // Response
    ];

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Document Request');

    // Generate filename
    const filename = `${documentRequest.projectName.replace(/\s+/g, '_')}_Request_${documentRequest.id}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);

    setSuccessMessage('Excel file downloaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'Tier 1': return 'priority-tier-1';
      case 'Tier 2': return 'priority-tier-2';
      case 'Tier 3': return 'priority-tier-3';
      default: return 'priority-default';
    }
  };

  if (loading) {
    return <div className="client-form-loading">Loading form...</div>;
  }

  if (error && !documentRequest) {
    return <div className="client-form-error">Error: {error}</div>;
  }

  if (!documentRequest) {
    return <div className="client-form-error">Form not found</div>;
  }

  return (
    <div className="client-form">
      <header className="client-form-header">
        <div className="header-brand">
          <div className="brand-icon">A</div>
          <div className="brand-name">AlixVault - Document Request Form</div>
        </div>
        <div className="header-actions">
          <button className="copy-link-btn" onClick={handleCopyLink}>
            📋 Copy Link
          </button>
          <button className="export-excel-btn" onClick={handleExportToExcel}>
            📊 Export to Excel
          </button>
        </div>
      </header>

      <div className="client-form-container">
        <div className="form-info-section">
          <Link to="/forms" className="back-link">← Back to Forms List</Link>
          <h1>Document Request Form</h1>
          <div className="project-info">
            <h2>{documentRequest.projectName}</h2>
            <p className="form-instructions">
              Please provide the requested information for each topic below. Fill out the text areas with relevant details.
            </p>
          </div>

          {successMessage && (
            <div className="success-banner">
              ✓ {successMessage}
            </div>
          )}

          {error && (
            <div className="error-banner">
              ✗ {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="topics-count-badge">
            {documentRequest.topics.length} Topic{documentRequest.topics.length !== 1 ? 's' : ''} Requested
          </div>

          {documentRequest.topics.map((topic, index) => (
            <div key={topic.id} className="form-topic-card">
              <div className="topic-header">
                <div className="topic-number">{index + 1}</div>
                <div className="topic-info">
                  <div className="topic-title-row">
                    <h3>{topic.topicName}</h3>
                    <span className={`priority-badge ${getPriorityClass(topic.priority)}`}>
                      {topic.priority}
                    </span>
                  </div>
                  <div className="topic-meta">
                    <span className="topic-category">{topic.categoryName}</span>
                    <span className="topic-label">{topic.topicLabel}</span>
                  </div>
                  {topic.description && (
                    <p className="topic-description">{topic.description}</p>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor={`topic-${topic.id}`}>
                  Your Response <span className="optional-text">(Optional)</span>
                </label>
                <textarea
                  id={`topic-${topic.id}`}
                  rows="4"
                  placeholder="Enter your response here..."
                  value={formResponses[topic.id] || ''}
                  onChange={(e) => handleInputChange(topic.id, e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/forms')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;
