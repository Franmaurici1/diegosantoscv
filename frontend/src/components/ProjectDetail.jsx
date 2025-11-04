import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await api.getProject(id);
        setProject(data);
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

  if (error || !project) {
    return (
      <div className="error">
        {error || 'Project not found'}
        <Link to="/projects" className="back-link">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <Link to="/projects" className="back-link">
        ← Back to Projects
      </Link>
      
      <div className="project-detail-header">
        {project.ImageUrl && (
          <img
            src={project.ImageUrl}
            alt={project.Title}
            className="project-detail-image"
          />
        )}
        <div className="project-detail-info">
          <h1>{project.Title}</h1>
          {project.Technologies && (
            <div className="technologies">
              {project.Technologies.split(',').map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech.trim()}
                </span>
              ))}
            </div>
          )}
          <div className="project-links">
            {project.LiveUrl && (
              <a
                href={project.LiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View Live Demo
              </a>
            )}
            {project.RepositoryUrl && (
              <a
                href={project.RepositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                View Repository
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-detail-content">
        <section className="description-section">
          <h2>Description</h2>
          <p>{project.Description}</p>
        </section>

        {project.CodeExplanation && (
          <section className="explanation-section">
            <h2>How It Works</h2>
            <p>{project.CodeExplanation}</p>
          </section>
        )}

        {project.CodeSnippet && (
          <section className="code-section">
            <h2>Code Snippet</h2>
            <pre className="code-block">
              <code>{project.CodeSnippet}</code>
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;

