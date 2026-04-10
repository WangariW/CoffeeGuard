import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import OutbreakTrendsChart from '../components/admin/OutbreakTrendsChart';
import CountyLeadsList from '../components/admin/CountyLeadsList';
import RecentReportsTable from '../components/admin/RecentReportsTable';
import { Download, Plus, FileText, AlertCircle, Users, CheckCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [reportsRes, countRes] = await Promise.all([
          api.get('/reports/all'),
          api.get('/user/count')
        ]);

        const allReports = reportsRes.data;
        setReports(allReports);

        // Compute stats from real data
        const totalReports = allReports.length;
        const activeOutbreaks = new Set(
          allReports.filter(r => r.severity === 'High').map(r => r.county)
        ).size;
        const totalFarmers = countRes.data?.count || 0;
        
        const totalConfidence = allReports.reduce((sum, r) => sum + (r.confidence || 0), 0);
        const avgConfidence = totalReports > 0 ? (totalConfidence / totalReports).toFixed(1) : '0';

        setStats({
          totalReports,
          activeOutbreaks,
          totalFarmers,
          avgConfidence,
        });
      } catch (err) {
        console.error('Admin data fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const topStats = stats ? [
    { title: 'Total Reports', value: stats.totalReports.toLocaleString(), subline: 'All-time database records', highlight: 'text-emerald-400', icon: <FileText className="w-5 h-5 text-emerald-400" />, iconBg: 'bg-emerald-500/10' },
    { title: 'Active Outbreaks', value: stats.activeOutbreaks.toString(), subline: 'High-risk county zones', highlight: 'text-red-400', icon: <AlertCircle className="w-5 h-5 text-red-400" />, iconBg: 'bg-red-500/10 border border-red-500/20 shadow-inner' },
    { title: 'Total Farmers', value: stats.totalFarmers.toLocaleString(), subline: 'Registered platform users', highlight: 'text-emerald-400', icon: <Users className="w-5 h-5 text-emerald-400" />, iconBg: 'bg-emerald-500/10' },
    { title: 'Avg. Detection Conf.', value: `${stats.avgConfidence}%`, subline: `Based on ${stats.totalReports} scans`, highlight: 'text-slate-400', icon: <CheckCircle className="w-5 h-5 text-slate-300" />, iconBg: 'bg-white/5' }
  ] : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-slate-400 font-bold">Loading admin data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
       <div className="space-y-10 fade-in animate-in slide-in-from-bottom-6 duration-700 pt-6">
         
         {/* Admin Header */}
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8">
           <div className="max-w-2xl">
             <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">Admin Oversight Panel</h1>
             <p className="text-slate-400 text-lg font-medium">
               System monitoring and outbreak management across Kenya.
             </p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 mt-2">
             <button className="flex w-full sm:w-auto justify-center items-center gap-2.5 bg-[#1e293b] border border-white/10 hover:border-white/20 hover:bg-[#2a374a] transition-all text-slate-300 font-bold py-3.5 px-6 rounded-xl shadow-lg">
               <Download className="w-4 h-4" />
               Export Report
             </button>
             <button className="flex w-full sm:w-auto justify-center items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 transition-all text-[#0f172a] font-extrabold py-3.5 px-6 rounded-xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95">
               <Plus className="w-5 h-5" />
               Add Regional Lead
             </button>
           </div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {topStats.map((stat, i) => (
             <div key={i} className="bg-[#1e293b] border border-white/5 rounded-[1.5rem] p-7 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-[13px] font-bold text-slate-400 mb-1">{stat.title}</p>
                   <h3 className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                 </div>
                 <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                   {stat.icon}
                 </div>
               </div>
               <p className={`text-[10px] font-extrabold uppercase tracking-widest ${stat.highlight}`}>
                  {stat.subline}
               </p>
             </div>
           ))}
         </div>

         {/* Middle Section: Chart + County Breakdown */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
             <OutbreakTrendsChart reports={reports} />
           </div>
           <div className="lg:col-span-1">
             <CountyLeadsList reports={reports} />
           </div>
         </div>

         {/* Bottom Section: Data Table */}
         <div>
           <RecentReportsTable />
         </div>

       </div>
    </DashboardLayout>
  );
}
