import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAnalyst } from '../../context/AnalystContext';
import { discussionService } from '../../services/discussionService';
import { useAuth } from '../../../contexts/AuthContext';
import { getEcho } from '../../../lib/echo';
import { analystDashboardService } from '../../services/analystDashboardService';

interface AnalystSidebarProps {
  isMobile?: boolean;
}

export const AnalystSidebar: React.FC<AnalystSidebarProps> = ({ isMobile = false }) => {
  const { user, sidebarCollapsed, toggleSidebar, setMobileMenuOpen } = useAnalyst();
  const { logout } = useAuth() || {};
  const location = useLocation();
  const [unreadChatCount, setUnreadChatCount] = React.useState<number>(0);
  const [waitingReviewCount, setWaitingReviewCount] = React.useState<number>(0);

  // Ambil jumlah proyek yang butuh review secara dinamis dari database
  React.useEffect(() => {
    analystDashboardService.getProjects()
      .then(res => {
        setWaitingReviewCount(res.waitingReviewCount || 0);
      })
      .catch(() => {});
  }, [location.pathname]);

  React.useEffect(() => {
    const updateCount = () => {
      discussionService.getTotalUnreadCount().then(setUnreadChatCount).catch(() => {});
    };

    updateCount();

    // Polling fallback 10s
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateCount();
      }
    }, 10000);

    // Echo listener untuk unread chat secara realtime
    const echo = getEcho();
    if (echo && user?.id && !isNaN(Number(user.id))) {
      const channel = echo.private(`user.${user.id}`);
      channel.listen('.ChatMessageSent', () => {
        updateCount();
      });
      return () => {
        clearInterval(interval);
        channel.stopListening('.ChatMessageSent');
      };
    }

    return () => clearInterval(interval);
  }, [location.pathname, user?.id]);

  const navItems = [
    {
      title: 'Dashboard',
      path: '/analyst/dashboard',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      title: 'Review Proyek',
      path: '/analyst/projects',
      icon: ClipboardCheck,
      badge: waitingReviewCount > 0 ? String(waitingReviewCount) : undefined
    },
    {
      title: 'Pesan',
      path: '/analyst/messages',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? String(unreadChatCount) : undefined
    },
  ];

  const handleLogout = async () => {
    localStorage.removeItem('pkspl_token');
    if (logout) {
      await logout();
    } else {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
    window.location.href = '/login';
  };

  const isCollapsed = !isMobile && sidebarCollapsed;

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-200 ease-in-out border-r border-slate-800 select-none z-40 ${
        isMobile
          ? 'w-72 h-full'
          : isCollapsed
          ? 'w-16 h-screen'
          : 'w-64 h-screen'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              PK
            </div>
            <div className="leading-tight truncate">
              <div className="text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
                <span>PKSPL</span>
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-400/30">
                  ANALYST
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Workspace Review</div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            PK
          </div>
        )}

        {/* Toggle / Close Button */}
        {isMobile ? (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Role Workspace Banner */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left truncate">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Quality Control Role
              </div>
              <div className="text-xs font-semibold text-slate-200">Reviewer & Validasi</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {!isCollapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/analyst/messages'
            ? location.pathname.startsWith('/analyst/messages') || location.pathname.startsWith('/analyst/discussions')
            : location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileMenuOpen(false)}
              title={isCollapsed ? item.title : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/40 px-1.5 py-0.2 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile & Logout Section */}
      <div className="p-2 border-t border-slate-800 space-y-1 bg-slate-950/20">
        {/* Profile Item */}
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/70 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-950 text-blue-300 border border-blue-700/50 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left truncate flex-1">
              <div className="font-semibold text-slate-100 truncate" title={user.name}>
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
            </div>
          </div>
        ) : (
          <div
            title={`${user.name} (${user.role})`}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            <User className="w-4 h-4" />
          </div>
        )}

        {/* Logout Button */}
        {!isCollapsed ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            className="w-full flex items-center justify-center p-2 rounded-lg text-rose-400 hover:bg-rose-950/30"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
