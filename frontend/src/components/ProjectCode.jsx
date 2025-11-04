import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProjectCode.css';

function ProjectCode() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id && id !== 'new') {
          const data = await api.getProject(id);
          setProject(data);
        } else {
          // For new projects without ID, just set loading to false
          setProject(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  return (
    <div className="project-code">
      <Link to="/" className="back-link">
        ← Back to CV
      </Link>
      
      <div className="project-code-content">
        <h1>Project Code</h1>
        
        {project ? (
          <div className="project-code-info">
            <h2>{project.Title}</h2>
            {project.CodeSnippet && (
              <div className="code-section">
                <h3>Code Snippet</h3>
                <pre className="code-block">
                  <code>{project.CodeSnippet}</code>
                </pre>
              </div>
            )}
            {project.CodeExplanation && (
              <div className="explanation-section">
                <h3>Explanation</h3>
                <p>{project.CodeExplanation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="project-code-placeholder">
            <h2>Project Code Details</h2>
            <p>This page will display the project code and implementation details.</p>
            <p>Project code content will be added here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCode;

