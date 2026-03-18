import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MyCoursesPage from './pages/MyCoursesPage'
import AdminCoursesPage from './pages/admin/AdminCoursesPage'
import AdminStudentsPage from './pages/admin/AdminStudentsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/giris" element={<LoginPage />} />
          <Route path="/kayit" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/panel" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="kurslarim" element={<MyCoursesPage />} />

            {/* Admin routes */}
            <Route path="admin/kurslar" element={
              <ProtectedRoute adminOnly>
                <AdminCoursesPage />
              </ProtectedRoute>
            } />
            <Route path="admin/ogrenciler" element={
              <ProtectedRoute adminOnly>
                <AdminStudentsPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
