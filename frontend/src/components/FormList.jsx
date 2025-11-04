import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './FormList.css';

function FormList() {
  const navigate = useNavigate();
  const [documentRequests, setDocumentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const requests = await api.getDocumentRequests();
        setDocumentRequests(requests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCopyLink = (requestId) => {
    const url = `${window.location.origin}/form/${requestId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(requestId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="form-list-loading">Loading forms...</div>;
  }

  if (error) {
    return <div className="form-list-error">Error: {error}</div>;
  }

  return (
    <div className="form-list">
      <div className="form-list-container">
        <div className="form-list-header">
          <div>
            <h1>Document Request Forms</h1>
            <p className="subtitle">Manage and share your document request forms with clients</p>
          </div>
          <Link to="/project-code/1" className="create-new-btn">
            + Create New Request
          </Link>
        </div>

        {documentRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No Forms Created Yet</h2>
            <p>Create your first document request to get started</p>
            <Link to="/project-code/1" className="empty-action-btn">
              Create Your First Request
            </Link>
          </div>
        ) : (
          <div className="forms-grid">
            {documentRequests.map((request) => (
              <div key={request.id} className="form-card">
                <div className="form-card-header">
                  <div className="form-card-icon">📄</div>
                  <div className="form-card-info">
                    <h3>{request.projectName}</h3>
                    <div className="form-card-meta">
                      <span className="meta-item">
                        📅 {formatDate(request.createdAt)}
                      </span>
                      <span className="meta-item">
                        📊 {request.topics?.length || 0} topics
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-card-status">
                  <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>

                <div className="form-card-actions">
                  <button
                    onClick={() => navigate(`/form/${request.id}`)}
                    className="action-btn btn-view"
                  >
                    👁️ View Form
                  </button>
                  <button
                    onClick={() => handleCopyLink(request.id)}
                    className={`action-btn btn-copy ${copiedId === request.id ? 'copied' : ''}`}
                  >
                    {copiedId === request.id ? '✓ Copied!' : '📋 Copy Link'}
                  </button>
                </div>

                {request.topics && request.topics.length > 0 && (
                  <div className="form-card-topics">
                    <div className="topics-preview">
                      {request.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="topic-tag">
                          {topic.topicName}
                        </span>
                      ))}
                      {request.topics.length > 3 && (
                        <span className="topic-tag more-topics">
                          +{request.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormList;
