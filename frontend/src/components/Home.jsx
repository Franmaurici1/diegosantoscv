import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ApiTest from './ApiTest';
import './Home.css';

function Home() {
  const [cvInfo, setCvInfo] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [cvData, workExpData, skillsData, educationsData] = await Promise.all([
          api.getCvInfo().catch((err) => {
            console.error('Error fetching CV info:', err);
            return null;
          }),
          api.getWorkExperiences().catch((err) => {
            console.error('Error fetching work experiences:', err);
            return [];
          }),
          api.getSkills().catch((err) => {
            console.error('Error fetching skills:', err);
            return [];
          }),
          api.getEducations().catch((err) => {
            console.error('Error fetching educations:', err);
            return [];
          }),
        ]);
        
        console.log('Fetched data:', { 
          cvData, 
          workExpData, 
          workExpLength: workExpData?.length,
          skillsData, 
          skillsLength: skillsData?.length,
          educationsData,
          educationsLength: educationsData?.length
        });
        
        setCvInfo(cvData);
        setWorkExperiences(Array.isArray(workExpData) ? workExpData : []);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
        setEducations(Array.isArray(educationsData) ? educationsData : []);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Group skills by category (handle both camelCase and PascalCase)
  const skillsByCategory = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    if (!skill) {
      return acc;
    }
    // Handle both camelCase (from API) and PascalCase
    const category = skill.category || skill.Category;
    const skillName = skill.name || skill.Name;
    const skillId = skill.id || skill.Id;
    
    if (!category) {
      console.warn('Invalid skill (no category):', skill);
      return acc;
    }
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...skill, category, name: skillName, id: skillId });
    return acc;
  }, {}) : {};
  
  console.log('Skills state:', skills);
  console.log('Skills by category:', skillsByCategory);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="home">
      <ApiTest />
      {/* Header Section */}
      <section className="cv-header">
        <div className="cv-header-content">
          <div className="profile-image-container">
            {(cvInfo?.profileImageUrl || cvInfo?.ProfileImageUrl) ? (
              <img
                src={cvInfo.profileImageUrl || cvInfo.ProfileImageUrl}
                alt={(cvInfo?.name || cvInfo?.Name) || 'Profile'}
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <span className="placeholder-icon">👤</span>
              </div>
            )}
          </div>
          <div className="cv-header-text">
            <h1>{(cvInfo?.name || cvInfo?.Name) || 'Your Name'}</h1>
            <h2 className="cv-title">{(cvInfo?.title || cvInfo?.Title) || '.NET Developer'}</h2>
            {(cvInfo?.bio || cvInfo?.Bio) && <p className="bio">{cvInfo.bio || cvInfo.Bio}</p>}
            <div className="social-links">
              {[
                (cvInfo?.email || cvInfo?.Email) && { 
                  type: 'email', 
                  url: `mailto:${cvInfo.email || cvInfo.Email}`, 
                  label: 'Email' 
                },
                (cvInfo?.linkedInUrl || cvInfo?.LinkedInUrl) && { 
                  type: 'linkedin', 
                  url: cvInfo.linkedInUrl || cvInfo.LinkedInUrl, 
                  label: 'LinkedIn', 
                  external: true 
                },
                (cvInfo?.gitHubUrl || cvInfo?.GitHubUrl) && { 
                  type: 'github', 
                  url: cvInfo.gitHubUrl || cvInfo.GitHubUrl, 
                  label: 'GitHub', 
                  external: true 
                },
              ]
                .filter(Boolean)
                .map((link) => (
                  <a
                    key={link.type}
                    href={link.url}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="social-link"
                  >
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="cv-section skills-section">
        <div className="section-container">
          <h2 className="section-title">Skills</h2>
          {Object.keys(skillsByCategory).length > 0 ? (
            <div className="skills-container">
              {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
                <div key={`category-${category}-${categoryIndex}`} className="skill-category">
                  <h3 className="skill-category-title">{category}</h3>
                  <ul className="skills-list">
                    {categorySkills.map((skill, skillIndex) => {
                      const skillName = skill.name || skill.Name;
                      const skillId = skill.id || skill.Id;
                      return (
                        <li key={skillId || `skill-${skillIndex}-${skillName}`} className="skill-item">
                          {skillName}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No skills data available. Check console for errors.</p>
          )}
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="cv-section work-experience-section">
        <div className="section-container">
          <h2 className="section-title">Work Experience</h2>
          {workExperiences.length > 0 ? (
            <div className="work-experiences-list">
              {workExperiences.map((work, index) => {
                const workId = work.id || work.Id;
                const position = work.position || work.Position;
                const company = work.company || work.Company;
                const startDate = work.startDate || work.StartDate;
                const endDate = work.endDate || work.EndDate;
                const isCurrent = work.isCurrent || work.IsCurrent;
                const description = work.description || work.Description;
                const projectName = work.projectName || work.ProjectName;
                const projectId = work.projectId || work.ProjectId;
                
                return (
                  <div key={workId || `work-${index}`} className="work-experience-item">
                    <div className="work-header">
                      <div className="work-title">
                        <h3>{position}</h3>
                        <h4 className="work-company">{company}</h4>
                      </div>
                      <div className="work-date">
                        {formatDate(startDate)} - {isCurrent ? 'Present' : formatDate(endDate)}
                      </div>
                    </div>
                    <p className="work-description">{description}</p>
                    {projectName && (
                      <div className="work-project-link">
                        <Link 
                          to={projectId ? `/project-code/${projectId}` : '/project-code/new'} 
                          className="btn-view-code"
                        >
                          View {projectName} Code →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No work experience data available. Check console for errors.</p>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="cv-section education-section">
        <div className="section-container">
          <h2 className="section-title">Education</h2>
          {educations.length > 0 ? (
            <div className="educations-list">
              {educations.map((edu, index) => {
                const eduId = edu.id || edu.Id;
                const degree = edu.degree || edu.Degree;
                const fieldOfStudy = edu.fieldOfStudy || edu.FieldOfStudy;
                const institution = edu.institution || edu.Institution;
                const startDate = edu.startDate || edu.StartDate;
                const endDate = edu.endDate || edu.EndDate;
                const description = edu.description || edu.Description;
                
                return (
                  <div key={eduId || `edu-${index}`} className="education-item">
                    <div className="education-header">
                      <div className="education-title">
                        <h3>{degree}</h3>
                        {fieldOfStudy && <h4 className="education-field">{fieldOfStudy}</h4>}
                        <h4 className="education-institution">{institution}</h4>
                      </div>
                      <div className="education-date">
                        {formatDate(startDate)} - {endDate ? formatDate(endDate) : 'Present'}
                      </div>
                    </div>
                    {description && <p className="education-description">{description}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No education data available. Check console for errors.</p>
          )}
        </div>
      </section>

      {/* Projects Link */}
      <section className="cv-section projects-link-section">
        <div className="section-container">
          <Link to="/projects" className="btn-view-projects">
            View All Projects →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
