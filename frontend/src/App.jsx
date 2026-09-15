import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';
import WriteBlog from './pages/WriteBlog';
import AdminDashboard from './pages/AdminDashboard';

/** Defines the WriteSpace client routes available at the current feature stage. */
export default function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ProtectedRoute><Home /></ProtectedRoute>} path="/blogs" />
      <Route element={<ProtectedRoute><ReadBlog /></ProtectedRoute>} path="/blog/:id" />
      <Route element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} path="/write" />
      <Route element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} path="/edit/:id" />
      <Route element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} path="/admin" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
