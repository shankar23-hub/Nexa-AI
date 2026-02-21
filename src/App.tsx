import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Cpu, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Plus,
  Search,
  Moon,
  Sun,
  Bell,
  User as UserIcon,
  Lock,
  MessageSquare,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Types
import { User, Staff, Project } from './types';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreatePage from './pages/CreatePage';
import Dashboard from './pages/Dashboard';
import StaffProfiles from './pages/StaffProfiles';
import ProjectStatus from './pages/ProjectStatus';
import AIProjectDistribution from './pages/AIProjectDistribution';
import SettingsPage from './pages/SettingsPage';
import PasswordChange from './pages/PasswordChange';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, setIsOpen, user, onLogout, isDark }: { isOpen: boolean, setIsOpen: (v: boolean) => void, user: User | null, onLogout: () => void, isDark: boolean }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Staff Profiles', path: '/staff' },
    { icon: Briefcase, label: 'Projects Status', path: '/projects' },
    { icon: Cpu, label: 'AI Distribution', path: '/ai-distribution' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? '280px' : '80px',
          x: 0 
        }}
        className={cn(
          "fixed top-0 left-0 h-full border-r z-50 transition-all duration-300 ease-in-out",
          isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-black/10",
          !isOpen && "hidden lg:block"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <span className="text-black font-black text-xl">N</span>
            </div>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-2xl font-black tracking-tighter",
                  isDark ? "neon-text" : "text-green-600"
                )}
              >
                NEXA
              </motion.span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                      : isDark ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-black/60 hover:bg-black/5 hover:text-black"
                  )}
                >
                  <item.icon size={24} className={cn(isActive && "neon-glow")} />
                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className={cn("p-4 border-t", isDark ? "border-white/10" : "border-black/10")}>
            {isOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isDark ? "bg-white/10" : "bg-black/10")}>
                    <UserIcon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{user?.username || 'Admin'}</span>
                    <span className={cn("text-xs", isDark ? "text-white/40" : "text-black/40")}>IT Head</span>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className={cn("p-2 transition-colors", isDark ? "text-white/40 hover:text-red-500" : "text-black/40 hover:text-red-500")}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogout}
                className={cn("w-full flex justify-center p-2", isDark ? "text-white/40 hover:text-red-500" : "text-black/40 hover:text-red-500")}
              >
                <LogOut size={24} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ onMenuClick, title, isDark, setIsDark }: { onMenuClick: () => void, title: string, isDark: boolean, setIsDark: (v: boolean) => void }) => {
  return (
    <header className={cn(
      "h-20 border-b backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between transition-colors duration-300",
      isDark ? "bg-[#050505]/80 border-white/10" : "bg-white/80 border-black/10"
    )}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className={cn("p-2 rounded-lg lg:hidden", isDark ? "hover:bg-white/5" : "hover:bg-black/5")}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className={cn(
          "hidden md:flex items-center border rounded-full px-4 py-2 gap-2 focus-within:border-green-500/50 transition-all",
          isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
        )}>
          <Search size={18} className={isDark ? "text-white/40" : "text-black/40"} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-64"
          />
        </div>

        <button 
          onClick={() => setIsDark(!isDark)}
          className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-black/5")}
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className={cn("p-2 rounded-full relative", isDark ? "hover:bg-white/5" : "hover:bg-black/5")}>
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
        </button>
      </div>
    </header>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nexa_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('nexa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('nexa_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('nexa_theme', 'light');
    }
  }, [isDark]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nexa_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexa_user');
  };

  if (loading) return null;

  return (
    <Router>
      <div className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-[#050505] text-white" : "bg-[#f5f5f5] text-[#1a1a1a]"
      )}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/create" element={user ? <Navigate to="/dashboard" /> : <CreatePage onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route 
            path="/*" 
            element={
              user ? (
                <div className="flex">
                  <Sidebar 
                    isOpen={isSidebarOpen} 
                    setIsOpen={setIsSidebarOpen} 
                    user={user} 
                    onLogout={handleLogout}
                    isDark={isDark}
                  />
                  <main className={cn(
                    "flex-1 transition-all duration-300",
                    isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"
                  )}>
                    <Header 
                      onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                      title="NEXA Portal" 
                      isDark={isDark}
                      setIsDark={setIsDark}
                    />
                    <div className="p-6 max-w-[1600px] mx-auto">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/staff" element={<StaffProfiles />} />
                        <Route path="/projects" element={<ProjectStatus />} />
                        <Route path="/ai-distribution" element={<AIProjectDistribution />} />
                        <Route path="/settings" element={<SettingsPage isDark={isDark} setIsDark={setIsDark} />} />
                        <Route path="/password-change" element={<PasswordChange />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
