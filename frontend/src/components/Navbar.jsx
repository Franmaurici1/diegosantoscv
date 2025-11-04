import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CV Portfolio
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/projects" className="navbar-link">
              Projects
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/forms" className="navbar-link">
              Forms
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

