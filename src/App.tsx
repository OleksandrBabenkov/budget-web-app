// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard'; // We'll create this in Phase 2
import { ProtectedRoute } from './components/ProtectedRoute';
import { Stats } from './pages/Stats'; // New Stats page

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- Protected Routes --- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
      {/* We will add a route for /stats here later */}
    </Routes>
  );
}

export default App;