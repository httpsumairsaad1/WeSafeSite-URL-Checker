import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ScanResults } from './components/ScanResults';
import { Settings } from './components/Settings';
import { Shield, Home, Settings as SettingsIcon, LogOut, Activity, Loader2 } from 'lucide-react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const isActive = (path: string) => location.pathname === path ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50';

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogout();
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <Shield className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl text-white tracking-tight">WeSafeSite</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <button onClick={() => navigate('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/dashboard')}`}>
                    <Home className="w-5 h-5" /> Dashboard
                </button>
                <button onClick={() => navigate('/scan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/scan')}`}>
                    <Activity className="w-5 h-5" /> Scans & Patches
                </button>
                <button onClick={() => navigate('/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/settings')}`}>
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
    );
};

const Layout: React.FC<{ children: React.ReactNode, onLogout: () => void }> = ({ children, onLogout }) => {
    return (
        <div className="flex min-h-screen bg-background text-slate-200">
            <Sidebar onLogout={onLogout} />
            <main className="flex-1 overflow-auto bg-slate-950/50">
                {children}
            </main>
        </div>
    );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

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
