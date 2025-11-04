import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProjectList.css';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h1>All Projects</h1>
        <p>Explore all the projects and side-projects</p>
      </div>
      <div className="projects-container">
        {projects.length === 0 ? (
          <div className="no-projects">No projects found.</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.Id} className="project-card">
                {project.ImageUrl && (
                  <img
                    src={project.ImageUrl}
                    alt={project.Title}
                    className="project-image"
                  />
                )}
                <div className="project-content">
                  <h3>{project.Title}</h3>
                  <p>{project.Description}</p>
                  {project.Technologies && (
                    <div className="technologies">
                      {project.Technologies.split(',').map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="project-actions">
                    <Link to={`/projects/${project.Id}`} className="btn-primary">
                      View Details
                    </Link>
                    {project.LiveUrl && (
                      <a
                        href={project.LiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;

