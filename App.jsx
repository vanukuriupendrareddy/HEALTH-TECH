import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Animals from './pages/Animals.jsx';
import AnimalDetail from './pages/AnimalDetail.jsx';
import Symptoms from './pages/Symptoms.jsx';
import Vaccinations from './pages/Vaccinations.jsx';
import Checkups from './pages/Checkups.jsx';
import Vets from './pages/Vets.jsx';
import Learn from './pages/Learn.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-screen">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/animals/:id" element={<AnimalDetail />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/vaccinations" element={<Vaccinations />} />
        <Route path="/checkups" element={<Checkups />} />
        <Route path="/vets" element={<Vets />} />
        <Route path="/learn" element={<Learn />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
