import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>
      <Footer />
    </div>
  );
}
