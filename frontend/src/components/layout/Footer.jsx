import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-white/5 py-12 mt-16 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 text-emerald-400 font-bold text-xl mb-4">
              <Leaf className="w-6 h-6 fill-current" />
              <span>CoffeeGuard</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Protecting Kenyan coffee heritage through AI innovation. Helping farmers in Nyeri, Kiambu, and beyond.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Disease Guide</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Weather Alerts</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Treatment FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Community</h3>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Farmer Forum</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Report Outbreak</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">County Stats</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all">
                <span className="text-xs">f</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all">
                <span className="text-xs">X</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all">
                <span className="text-xs">@</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-10 pt-8 flex justify-center text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} CoffeeGuard. Built for the small-scale farmers of Kenya.
        </div>
      </div>
    </footer>
  );
}
