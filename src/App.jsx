import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import ClientDetail from './pages/ClientDetail';
import { LayoutDashboard, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-800 min-h-screen flex flex-col items-center justify-center">
          <AlertCircle size={48} className="mb-4" />
          <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
          <pre className="p-4 bg-white rounded border border-red-100 max-w-2xl overflow-auto text-xs">
            {this.state.error && this.state.error.toString()}
            {"\n\n"}
            {this.state.error && this.state.error.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (newUser, newToken) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="flex h-screen w-full bg-background font-sans overflow-hidden relative">
        {token && (
          <>
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-30 transform transition-transform duration-300' : 'relative'}
              ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            `}>
              <Sidebar onLogout={handleLogout} user={user} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} isDarkMode={isDarkMode} />
            </div>
          </>
        )}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {token && isMobile && (
            <div className="h-16 bg-surface flex items-center justify-between px-6 shrink-0 z-10 border-b border-border shadow-sm transition-colors duration-300">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 bg-background border border-border rounded-xl text-textMuted hover:text-primary transition-all active:scale-95 shadow-sm"
                title={isSidebarOpen ? "Deactivate Menu" : "Activate Protocol"}
              >
                <div className="space-y-1.5 overflow-hidden">
                  <div className={`w-5 h-0.5 bg-primary transition-all duration-300 ${isSidebarOpen ? 'translate-x-1' : ''}`}></div>
                  <div className="w-5 h-0.5 bg-primary"></div>
                  <div className={`w-5 h-0.5 bg-primary transition-all duration-300 ${isSidebarOpen ? '-translate-x-1' : ''}`}></div>
                </div>
              </button>
              <div className="flex items-center gap-4 group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-emerald-800 to-accent flex items-center justify-center shadow-lg shadow-accent/20">
                    <span className="text-white font-black text-sm drop-shadow-md">A</span>
                 </div>
                 <span className="text-textMain font-black text-sm uppercase tracking-tighter group-hover:tracking-widest transition-all">AMIGO</span>
              </div>
              <div className="w-10"></div> {/* Spacer for symmetry */}
            </div>
          )}
          <div className="flex-1 overflow-y-auto text-textMain">
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard/clients/:id" element={token ? <ClientDetail user={user} /> : <Navigate to="/login" />} />
                <Route path="/dashboard/*" element={token ? <Dashboard user={user} onLogout={handleLogout} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
