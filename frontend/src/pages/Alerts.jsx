import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AlertMap from '../components/alerts/AlertMap';
import LiveReportsFeed from '../components/alerts/LiveReportsFeed';
import { Plus, Loader2, X, ArrowUpRight } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Alerts() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/all');
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Derive unique counties from real data
  const counties = ['All', ...new Set(reports.map(r => r.county).filter(Boolean))];

  // Filter reports by selected county
  const filteredReports = selectedCounty === 'All'
    ? reports
    : reports.filter(r => r.county === selectedCounty);

  // Compute stats from real data
  const highRiskCount = new Set(
    filteredReports.filter(r => r.severity === 'High').map(r => r.county)
  ).size;

  const diseaseCounts = {};
  filteredReports.forEach(r => {
    const d = r.disease || 'Unknown';
    diseaseCounts[d] = (diseaseCounts[d] || 0) + 1;
  });
  const topDisease = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return (
    <DashboardLayout>
       <div className="space-y-10 fade-in animate-in slide-in-from-bottom-4 duration-500 pt-2 lg:pt-8">
         
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8">
           <div className="max-w-2xl">
             <div className="inline-block border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-sm">
               Regional Health Network
             </div>
             <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">Community Health Alerts</h1>
             <p className="text-slate-400 text-base leading-relaxed font-medium max-w-xl">
               Stay updated with active disease outbreaks reported across Kenya's coffee-growing regions. Together, we can mitigate spread through early detection and collaborative reporting.
             </p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0 mt-2 md:mt-0">
             <div className="flex flex-col">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Filter by County</label>
               <div className="relative">
                 <select 
                   value={selectedCounty}
                   onChange={(e) => setSelectedCounty(e.target.value)}
                   className="bg-[#1e293b] border border-white/10 text-white text-sm rounded-xl px-5 py-3.5 outline-none focus:border-emerald-500/50 appearance-none min-w-[200px] font-bold cursor-pointer hover:border-white/20 transition-colors shadow-inner"
                 >
                   {counties.map(c => (
                     <option key={c} value={c}>{c === 'All' ? 'All Counties' : c}</option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </div>
               </div>
             </div>
             
             <button 
               onClick={() => navigate('/dashboard')}
               className="mt-0 sm:mt-5 bg-emerald-500 hover:bg-emerald-400 transition-all text-[#0f172a] font-extrabold py-3.5 px-6 rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 text-sm"
             >
               <Plus className="w-5 h-5" />
               Report Outbreak
             </button>
           </div>
         </div>

         {/* Grid Layout */}
         {loading ? (
           <div className="flex flex-col items-center justify-center py-32">
             <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
             <p className="text-slate-400 font-bold">Loading regional data...</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
             <div className="min-h-[600px] lg:min-h-0 overflow-hidden">
               <AlertMap 
                 reports={filteredReports} 
                 highRiskCount={highRiskCount}
                 topDisease={topDisease}
                 totalReports={filteredReports.length}
               />
             </div>
             <div className="min-h-[500px] lg:min-h-0">
               <LiveReportsFeed reports={filteredReports} />
             </div>
           </div>
         )}

       </div>
    </DashboardLayout>
  );
}
