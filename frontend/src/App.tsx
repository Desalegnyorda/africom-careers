import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegistrationForm from './components/registration/RegistrationForm';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={
          <Layout showHero={true}>
            {/* We wrap the form in a standard container here. 
               The Layout handles the full-width background, 
               and the form handles the scrolling sections.
            */}
            <div className="max-w-6xl mx-auto">
               <RegistrationForm />
            </div>
          </Layout>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;