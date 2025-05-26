import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Home, History, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <ShoppingCart className="mr-2" />
            No Big Deal
          </Link>
          <div className="text-sm">
            {user.email}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-gray-200">
        <nav className="container mx-auto">
          <ul className="flex justify-around py-3">
            <li>
              <Link 
                to="/" 
                className={`flex flex-col items-center p-2 ${
                  location.pathname === '/' ? 'text-emerald-600' : 'text-gray-600'
                }`}
              >
                <Home size={20} />
                <span className="text-xs mt-1">Home</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/history" 
                className={`flex flex-col items-center p-2 ${
                  location.pathname === '/history' ? 'text-emerald-600' : 'text-gray-600'
                }`}
              >
                <History size={20} />
                <span className="text-xs mt-1">History</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex flex-col items-center p-2 ${
                  location.pathname === '/settings' ? 'text-emerald-600' : 'text-gray-600'
                }`}
              >
                <Settings size={20} />
                <span className="text-xs mt-1">Settings</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleSignOut}
                className="flex flex-col items-center p-2 text-gray-600"
              >
                <LogOut size={20} />
                <span className="text-xs mt-1">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;