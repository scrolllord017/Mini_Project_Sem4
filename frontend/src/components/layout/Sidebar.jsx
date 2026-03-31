import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Create Quiz', path: '/teacher/create-quiz', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] hidden md:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
             <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
