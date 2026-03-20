import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, User } from 'firebase/auth';
import { Plane, User as UserIcon, LogOut, History, Search } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function Navbar({ user, profile }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Plane className="rotate-45" />
          <span>SkyStream</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/search" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <Search size={18} />
            <span>Search</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/history" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                <History size={18} />
                <span>My Bookings</span>
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-900">{profile?.displayName || user.email}</span>
                  <span className="text-xs text-slate-500 capitalize">{profile?.role || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
