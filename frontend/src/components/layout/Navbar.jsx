import React from 'react';
import { Leaf, LayoutDashboard, MapPin, Settings, Bell, ShieldCheck, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', path: '/alerts', icon: MapPin },
    { name: 'Admin', path: '/admin', icon: ShieldCheck },
  ];

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-white/5 bg-[#0f172a]/95 backdrop-blur-xl text-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-emerald-400 font-bold text-xl hover:text-emerald-300 transition">
              <Leaf className="w-6 h-6 fill-current" />
              <span>CoffeeGuard</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6 h-16">
                {navLinks.map((link) => {
                  const isActive = location.pathname.includes(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-2 px-1 py-5 border-b-2 text-sm font-bold transition-colors ${
                        isActive
                          ? 'border-emerald-500 text-emerald-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-slate-200 transition">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-200 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-[#0f172a] bg-red-500"></span>
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="ml-1 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20">
              {userInitial}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
