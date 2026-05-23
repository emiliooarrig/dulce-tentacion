import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/contacto" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
