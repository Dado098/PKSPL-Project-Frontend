import React, { useState } from 'react';
import {
  Bell,
  Menu,
  RotateCw,
  User,
  CheckCircle2,
  AlertCircle,
  FolderX,
  Clock
} from 'lucide-react';
import { useAnalyst } from '../../context/AnalystContext';

export const AnalystTopbar: React.FC = () => {
  const { user, demoState, setDemoState, refreshData, isLoading, setMobileMenuOpen } = useAnalyst();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu Toggle & Title Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Dashboard Analyst
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Reviewer Workspace
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 hidden md:block">
            Pantau status penelitian, proses review, revisi, dan aktivitas proyek.
          </p>
        </div>
      </div>

      {/* Right: State Switcher (QA Demo), Notifications, & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* State Switcher for QA / Developer Verification */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-[10px] font-semibold text-slate-500 px-2 uppercase tracking-wider">
            Demo State:
          </span>
          <button
            onClick={() => setDemoState('normal')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              demoState === 'normal'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setDemoState('loading')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              demoState === 'loading'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Loading
          </button>
          <button
            onClick={() => setDemoState('empty')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              demoState === 'empty'
                ? 'bg-white text-amber-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Empty
          </button>
          <button
            onClick={() => setDemoState('error')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              demoState === 'error'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Error
          </button>
        </div>

        {/* Refresh Data Button */}
        <button
          onClick={refreshData}
          disabled={isLoading}
          title="Segarkan data dashboard"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Notifications Icon with Placeholder Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(prev => !prev);
              setShowProfileDropdown(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 relative transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifikasi Masuk</span>
                <span className="text-[11px] text-blue-600 font-medium">3 baru</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="text-xs font-medium text-slate-800">Pengajuan Proyek Baru</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Revitalisasi Mangrove Teluk Benoa siap direview.</div>
                  <div className="text-[10px] text-slate-400 mt-1">15 menit lalu</div>
                </div>
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="text-xs font-medium text-slate-800">Revisi Terkirim</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Peneliti mengirim revisi data spasial Teluk Banten.</div>
                  <div className="text-[10px] text-slate-400 mt-1">3 jam lalu</div>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Analyst */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(prev => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-semibold text-slate-800 truncate max-w-[140px]" title={user.name}>
                {user.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{user.role}</span>
              </div>
            </div>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-800">{user.name}</div>
                <div className="text-[11px] text-slate-500">{user.email}</div>
                <div className="mt-1.5">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-100">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="py-2 px-4 text-xs text-slate-600 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Status Akun:</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Aktif & Terverifikasi
                </span>
              </div>
              <div className="pt-1 px-2">
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full text-center px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
