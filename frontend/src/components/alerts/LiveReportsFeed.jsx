import React from 'react';
import { List, Clock, MapPin, ChevronRight, ShieldAlert } from 'lucide-react';

export default function LiveReportsFeed({ reports = [] }) {

  const getRiskColors = (risk) => {
    switch(risk) {
      case 'High': return { badge: 'bg-red-500', text: 'text-red-500', overlay: 'from-red-500/10' };
      case 'Medium': return { badge: 'bg-amber-500', text: 'text-amber-500', overlay: 'from-amber-500/10' };
      case 'Low': return { badge: 'bg-emerald-500 text-slate-900', text: 'text-emerald-500', overlay: 'from-emerald-500/10' };
      default: return { badge: 'bg-emerald-500 text-slate-900', text: 'text-emerald-500', overlay: 'from-emerald-500/10' };
    }
  };

  const getMockImage = (disease) => {
    if (!disease) return '/infected_leaf.png';
    const lower = disease.toLowerCase();
    if (lower.includes('rust')) return '/infected_leaf.png';
    if (lower.includes('berry')) return '/coffee_berry_disease.png';
    return '/cercospora.png';
  };

  const formatTimeAgo = (dateString) => {
    const diffMs = new Date() - new Date(dateString);
    if (isNaN(diffMs)) return 'Recently';
    const diffHrs = Math.floor(diffMs / 3600000);
    if (diffHrs === 0) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
           <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
             <List className="w-5 h-5" />
           </div>
           Live Reports Feed
        </h3>
        <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
          {reports.length > 0 ? `${reports.length} Active Alerts` : 'No Alerts'}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {reports.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
                <ShieldAlert className="w-12 h-12 text-emerald-500/50 mb-3" />
                <p className="font-bold text-slate-400">No reports match this filter.</p>
             </div>
        ) : (
          reports.map((report) => {
            const riskValue = report.severity || 'Medium';
            const colors = getRiskColors(riskValue);
            return (
              <div key={report.id} className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden flex h-40 shadow-xl group hover:border-white/15 hover:bg-slate-800/80 transition-all cursor-pointer relative">
                {/* Image Section */}
                <div className="w-32 sm:w-40 relative flex-shrink-0">
                  <div className="absolute inset-0 bg-black/10 z-10"></div>
                  <img src={getMockImage(report.disease)} alt={report.disease} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute top-3 left-3 ${colors.badge} ${riskValue!=='Low'?'text-white':''} text-[9px] uppercase font-bold px-2 py-1 rounded shadow-sm z-20 backdrop-blur-md`}>
                    {riskValue} Risk
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.overlay} to-transparent rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100`}></div>
                  
                  <div className="relative z-10 w-full flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 bg-white/5 inline-flex px-2 py-0.5 rounded border border-white/5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimeAgo(report.created_at)}
                      </div>
                      <h4 className="text-lg font-bold text-white leading-tight mb-1.5 capitalize">{report.disease}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500/70" />
                        {report.county} Region
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 opacity-0 md:opacity-100 uppercase tracking-widest">{report.county}</span>
                  </div>

                  <div className="relative z-10 flex items-end justify-between mt-auto">
                     <p className="text-[11px] text-slate-500 font-medium">
                       <span className="text-emerald-400 font-bold">{report.confidence}%</span> confidence
                     </p>
                     <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                       Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
