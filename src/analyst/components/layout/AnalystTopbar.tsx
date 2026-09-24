import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  RotateCw,
  User,
  CheckCircle2,
  AlertCircle,
  FolderX,
  Clock,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { useAnalyst } from '../../context/AnalystContext';
import { notificationService, AppNotification } from '../../services/notificationService';
import { getEcho } from '../../../lib/echo';

export const AnalystTopbar: React.FC = () => {
  const { user, demoState, setDemoState, refreshData, isLoading, setMobileMenuOpen } = useAnalyst();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState<boolean>(false);

  const loadNotifications = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        notificationService.getNotifications(10),
        notificationService.getUnreadCount()
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.warn('Gagal memuat notifikasi:', err);
    }
  }, []);

  // Inisialisasi notifikasi dan realtime listener
  useEffect(() => {
    loadNotifications();

    // Polling fallback setiap 15 detik
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
      }
    }, 15000);

    // Echo listener untuk notifikasi pengguna secara realtime
    const echo = getEcho();
    if (echo && user?.id && !isNaN(Number(user.id))) {
      const channel = echo.private(`user.${user.id}`);
      channel.listen('.ChatMessageSent', () => {
        loadNotifications();
      });
      return () => {
        clearInterval(interval);
        channel.stopListening('.ChatMessageSent');
      };
    }

    return () => clearInterval(interval);
  }, [loadNotifications, user?.id]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Gagal menandai semua dibaca:', err);
    }
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.is_read) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (e) {
        // ignore
      }
    }

    setShowNotifications(false);

    // Navigasi sesuai konteks notifikasi
    if (notif.data?.conversation_id || notif.data?.type === 'chat_message') {
      navigate('/analyst/messages');
    } else if (notif.data?.action_url) {
      navigate(notif.data.action_url);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
      if (diff < 60) return 'Baru saja';
      if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
      return `${Math.floor(diff / 86400)} hari lalu`;
    } catch {
      return '';
    }
  };

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

        {/* Notifications Icon with Dynamic Dropdown */}
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Belum ada notifikasi baru
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isChat = notif.data?.type === 'chat_message';
                    const isUnread = !notif.is_read;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 transition-colors cursor-pointer ${
                          isUnread ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                            )}
                            <span className="truncate">
                              {isChat
                                ? `Pesan Baru dari ${notif.data.sender_name || 'Peneliti'}`
                                : notif.data?.title || notif.type || 'Pemberitahuan Sistem'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatTimeAgo(notif.created_at)}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {notif.data?.message || notif.data?.description || 'Klik untuk melihat detail pemberitahuan.'}
                        </div>

                        {notif.data?.project_name && (
                          <div className="text-[10px] text-blue-600 font-medium mt-1 truncate">
                            📁 {notif.data.project_name}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
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
