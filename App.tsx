import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ScanResults } from './components/ScanResults';
import { Settings } from './components/Settings';
import { Shield, Home, Settings as SettingsIcon, LogOut, Activity, Loader2, Menu, X } from 'lucide-react';

const Sidebar: React.FC<{ onLogout: () => void, isOpen: boolean, onClose: () => void }> = ({ onLogout, isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const isActive = (path: string) => location.pathname === path ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50';

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose(); // Close sidebar on mobile after navigation
    };

    const handleLogout = async () => {
        onLogout();
        navigate('/');
    };

    // Sidebar classes handling mobile (fixed) vs desktop (sticky)
    const sidebarClasses = `
        bg-slate-950 border-r border-slate-800 flex flex-col h-screen 
        fixed top-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0
    `;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={sidebarClasses}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>
                        <Shield className="w-8 h-8 text-primary" />
                        <span className="font-bold text-xl text-white tracking-tight">WeSafeSite</span>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <button onClick={() => handleNavigation('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/dashboard')}`}>
                        <Home className="w-5 h-5" /> Dashboard
                    </button>
                    <button onClick={() => handleNavigation('/scan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/scan')}`}>
                        <Activity className="w-5 h-5" /> Scans & Patches
                    </button>
                    <button onClick={() => handleNavigation('/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/settings')}`}>
                        <SettingsIcon className="w-5 h-5" /> Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-4 py-2 transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

const Layout: React.FC<{ children: React.ReactNode, onLogout: () => void }> = ({ children, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-slate-200">
            <Sidebar onLogout={onLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        <span className="font-bold text-lg text-white">WeSafeSite</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-slate-200 p-2">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-auto bg-slate-950/50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent login simulation
    const storedAuth = localStorage.getItem('wesafesite_auth');
    if (storedAuth === 'true') {
        setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = () => {
      localStorage.setItem('wesafesite_auth', 'true');
      setIsAuthenticated(true);
  };
  const logout = () => {
      localStorage.removeItem('wesafesite_auth');
      setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Entry Point: Landing Page. Redirect to dashboard if already logged in */}
        <Route path="/" element={
            !isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />
        } />
        
        {/* Authentication: Login/Signup. Redirect to dashboard on success */}
        <Route path="/login" element={
            !isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/dashboard" />
        } />

        {/* Protected Route: Dashboard. Redirect to LANDING if not authenticated (first screen rule) */}
        <Route path="/dashboard" element={
            isAuthenticated ? (
                <Layout onLogout={logout}>
                    <Dashboard onNavigate={(page) => console.log('nav', page)} />
                </Layout>
            ) : <Navigate to="/" />
        } />

        {/* Protected Route: Scan Results */}
        <Route path="/scan" element={
            isAuthenticated ? (
                <Layout onLogout={logout}>
                    <ScanResults />
                </Layout>
            ) : <Navigate to="/" />
        } />

         {/* Protected Route: Settings */}
         <Route path="/settings" element={
            isAuthenticated ? (
                <Layout onLogout={logout}>
                    <Settings />
                </Layout>
            ) : <Navigate to="/" />
        } />

        {/* Catch-all: Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}