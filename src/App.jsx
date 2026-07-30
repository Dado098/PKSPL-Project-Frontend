import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './components/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import MasterDataPage from './pages/admin/MasterDataPage'
import VerifikasiDataPage from './pages/admin/VerifikasiDataPage'
import ManajemenPenggunaPage from './pages/admin/ManajemenPenggunaPage'
import RiwayatAktivitasPage from './pages/admin/RiwayatAktivitasPage'
import KebijakanPage from './pages/admin/KebijakanPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="master-data" element={<MasterDataPage />} />
          <Route path="verifikasi-data" element={<VerifikasiDataPage />} />
          <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />
          <Route path="riwayat-aktivitas" element={<RiwayatAktivitasPage />} />
          <Route path="kebijakan" element={<KebijakanPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
