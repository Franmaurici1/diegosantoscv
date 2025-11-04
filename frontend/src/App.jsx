import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProjectCode from './components/ProjectCode';
import DocumentRequest from './components/DocumentRequest';
import FormList from './components/FormList';
import ClientForm from './components/ClientForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/project-code/:id" element={<DocumentRequest />} />
          <Route path="/forms" element={<FormList />} />
          <Route path="/form/:requestId" element={<ClientForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
