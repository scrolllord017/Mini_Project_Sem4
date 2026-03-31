import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function TeacherLayout() {
  return (
    <div className="flex bg-surface min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
