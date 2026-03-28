import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { LogOut, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, teacher, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 text-primary-600">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold">Brainbuzz</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Welcome, {teacher?.name || 'Teacher'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )
          }
        </div>
      </div>
    </nav>
  );
}
