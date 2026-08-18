import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import StatsSection from './components/StatsSection'
import WorkflowSection from './components/WorkflowSection'
import MapSection from './components/MapSection'
import Footer from './components/Footer'
import DashboardPage from './components/dashboard/DashboardPage'
import ProjectDetailPage from './components/map/ProjectDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/DashboardPage'
import MasterDataPage from './pages/admin/MasterDataPage'
import ManajemenPenggunaPage from './pages/admin/ManajemenPenggunaPage'
import VerifikasiDataPage from './pages/admin/VerifikasiDataPage'
import RiwayatAktivitasPage from './pages/admin/RiwayatAktivitasPage'
import KebijakanPage from './pages/admin/KebijakanPage'
import ProjectsPage from './pages/valuasi/ProjectsPage'
import ValuasiDetailPage from './pages/valuasi/ValuasiDetailPage'
import ProjectIndexPage from './pages/valuasi/ProjectIndexPage'
import ModuleDashboardPage from './pages/valuasi/ModuleDashboardPage'

function LandingPageContent() {
  const [currentView, setCurrentView] = useState('home')
  const [projectId, setProjectId] = useState(null)

  // Hash-based routing for sub-pages within the landing page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')

      // Check for project detail route: #project/flora-001
      if (hash.startsWith('project/')) {
        const id = hash.replace('project/', '')
        setProjectId(id)
        setCurrentView('project')
      } else if (hash === 'dashboard') {
        setProjectId(null)
        setCurrentView('dashboard')
      } else {
        setProjectId(null)
        setCurrentView('home')
      }
    }

    // Set initial view from hash
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (page) => {
    window.location.hash = page
  }

  // Dashboard Page (AI Analysis)
  if (currentView === 'dashboard') {
    return (
      <DashboardPage onNavigateHome={() => navigateTo('home')} />
    )
  }

  // Project Detail Page
  if (currentView === 'project' && projectId) {
    return (
      <ProjectDetailPage
        projectId={projectId}
        onBack={() => {
          navigateTo('home')
          // Scroll to map section after navigation
          setTimeout(() => {
            const mapEl = document.getElementById('map')
            if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }}
      />
    )
  }

  // Landing Page (Home)
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar onNavigateDashboard={() => navigateTo('dashboard')} />
      <main>
        <HeroSection />
        <AboutSection />
        <MapSection />
        <WorkflowSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/valuasi/projects" element={<ProjectsPage />} />
        <Route path="/valuasi/projects/:projectId/index/:indexId" element={<ValuasiDetailPage />} />
        <Route path="/valuasi/projects/:projectId/modules/:moduleId" element={<ProjectIndexPage />} />
        <Route path="/valuasi/projects/:projectId/modules" element={<ModuleDashboardPage />} />
        <Route path="/valuasi/projects/:projectId" element={<ModuleDashboardPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="master-data" element={<MasterDataPage />} />
          <Route path="verifikasi-data" element={<VerifikasiDataPage />} />
          <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />
          <Route path="riwayat-aktivitas" element={<RiwayatAktivitasPage />} />
          <Route path="kebijakan" element={<KebijakanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
