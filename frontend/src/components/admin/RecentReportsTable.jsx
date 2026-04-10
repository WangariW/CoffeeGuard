import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle2, AlertTriangle, MoreHorizontal, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function RecentReportsTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/all');
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load admin reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d) ? 'Recent' : d.toLocaleDateString();
  };

  return (
    <div className="bg-[#1e293b] border border-white/5 rounded-[2rem] shadow-xl flex-col flex overflow-hidden">
      
      {/* Table Header area */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border-b border-white/5 gap-6">
        <div>
           <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Recent Disease Reports</h3>
           <p className="text-sm font-medium text-slate-400">Review and verify farmer submissions for regional escalation.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search reports..." className="w-full bg-[#0f172a] shadow-inner border border-white/10 text-white text-sm font-semibold rounded-xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          
          <div className="relative hidden sm:block">
            <select className="bg-[#0f172a] shadow-inner border border-white/10 text-slate-300 text-sm font-bold rounded-xl py-3 pl-4 pr-10 outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors shrink-0">
              <option>All Counties</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <button className="bg-[#0f172a] shadow-inner border border-white/10 text-slate-300 p-3 rounded-xl hover:bg-white/5 transition-colors shrink-0 outline-none">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
             <div className="flex flex-col items-center justify-center h-[300px] text-emerald-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="font-bold text-slate-400">Syncing live reports...</p>
             </div>
        ) : reports.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[300px]">
                <p className="font-bold text-slate-400">No reports found.</p>
             </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                <th className="py-6 px-8 whitespace-nowrap">Sample</th>
                <th className="py-6 px-8 whitespace-nowrap">Farmer ID</th>
                <th className="py-6 px-8 whitespace-nowrap">County</th>
                <th className="py-6 px-8 whitespace-nowrap">Disease ID</th>
                <th className="py-6 px-8 whitespace-nowrap">Risk Level</th>
                <th className="py-6 px-8 whitespace-nowrap">Date Reported</th>
                <th className="py-6 px-8 whitespace-nowrap">Status</th>
                <th className="py-6 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 px-8">
                      <div className="w-14 h-14 rounded-[10px] bg-slate-800 flex items-center justify-center border border-white/10 text-slate-500">
                          {/* Real images would go here, mock icon for now */}
                          <AlertTriangle className="w-5 h-5 opacity-50" />
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <p className="text-sm font-bold text-white mb-0.5 whitespace-nowrap">U-{r.user_id}</p>
                      <p className="text-[11px] font-bold tracking-widest text-slate-500">REP-{r.id}</p>
                    </td>
                    <td className="py-4 px-8 text-sm font-bold text-slate-300">{r.county}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-2.5">
                         <span className={`w-2 h-2 rounded-full ${r.disease.includes('Healthy') ? 'bg-slate-600' : 'bg-emerald-500'}`}></span>
                         <span className="text-sm font-bold text-emerald-50/90 whitespace-nowrap">{r.disease}</span>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                       <span className={`inline-flex px-2.5 py-1 rounded text-[10px] uppercase font-black tracking-widest border border-white/5 shadow-sm ${
                         r.severity === 'High' ? 'bg-red-500 text-white' : 
                         r.severity === 'Medium' ? 'bg-amber-500 text-[#0f172a]' : 
                         'bg-[#0f172a] text-emerald-400'
                       }`}>
                         {r.severity || 'Unknown'}
                       </span>
                    </td>
                    <td className="py-4 px-8 text-sm font-medium text-slate-400 flex items-center gap-2 mt-5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 opacity-50" /> {formatDate(r.created_at)}
                    </td>
                    <td className="py-4 px-8">
                       <div className="flex items-center gap-2 relative">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span className="text-sm font-bold text-emerald-400">Verified</span>
                       </div>
                    </td>
                    <td className="py-4 px-8 text-right">
                       <button className="text-slate-500 hover:text-white font-bold outline-none group-hover:bg-white/5 p-2 rounded-lg transition-colors leading-none">
                         <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 md:px-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0f172a]/40 backdrop-blur-sm">
         <p className="text-sm font-bold text-slate-400">Showing {reports.length} global reports</p>
         <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-[#1e293b] border border-white/10 shadow hover:border-white/20 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all opacity-50">Previous</button>
            <button className="px-5 py-2.5 bg-[#2a374a] border border-white/20 shadow-md hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all opacity-50">Next</button>
         </div>
      </div>
    </div>
  );
}
