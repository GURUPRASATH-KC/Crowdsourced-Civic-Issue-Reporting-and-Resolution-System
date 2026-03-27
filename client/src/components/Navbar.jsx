import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <MapPin className="h-6 w-6" />
            CivicFix
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Map & Issues</Link>
            {user ? (
              <>
                <Link to="/report" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Report Issue</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                )}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User className="h-4 w-4 text-blue-500" /> {user.name}
                  </span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-full" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Log in</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
