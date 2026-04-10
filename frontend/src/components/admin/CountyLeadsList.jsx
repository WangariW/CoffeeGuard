import React, { useMemo } from 'react';
import { ChevronRight, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CountyLeadsList({ reports = [] }) {

  // Build county breakdown from real report data
  const countyData = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      const c = r.county || 'Unknown';
      if (!map[c]) map[c] = { count: 0, highCount: 0 };
      map[c].count++;
      if (r.severity === 'High') map[c].highCount++;
    });

    return Object.entries(map)
      .map(([county, data]) => ({
        county,
        count: data.count,
        highCount: data.highCount,
        risk: data.highCount > 0 ? 'high' : data.count > 3 ? 'medium' : 'low',
      }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'high': return { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: 'High Risk' };
      case 'medium': return { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Active' };
      default: return { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'Stable' };
    }
  };

  return (
    <div className="bg-[#1e293b] border border-white/5 rounded-[2rem] p-8 shadow-xl h-full min-h-[420px] flex flex-col relative overflow-hidden">
      <div className="mb-6 z-10 relative">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">County Breakdown</h3>
        <p className="text-sm text-slate-400 font-medium leading-relaxed">
          {countyData.length} {countyData.length === 1 ? 'county' : 'counties'} with active reports.
        </p>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>

      <div className="flex-1 space-y-3 z-10 relative overflow-y-auto custom-scrollbar pr-1">
        {countyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <MapPin className="w-8 h-8 mb-2 opacity-40" />
            <p className="font-bold text-sm">No county data yet</p>
          </div>
        ) : (
          countyData.map(item => {
            const badge = getRiskBadge(item.risk);
            return (
              <div key={item.county} className="flex items-center justify-between group hover:bg-white/[0.04] p-3 -mx-3 rounded-2xl transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className={`relative p-3 rounded-xl border ${badge.bg} shadow-inner`}>
                     {item.risk === 'high' 
                       ? <AlertTriangle className={`w-5 h-5 ${badge.text}`} /> 
                       : <CheckCircle className={`w-5 h-5 ${badge.text}`} />
                     }
                   </div>
                   <div>
                     <h4 className="text-[15px] font-bold text-white mb-0.5">{item.county}</h4>
                     <p className="text-xs font-semibold text-slate-400">{item.count} reports · {item.highCount} high severity</p>
                   </div>
                </div>
                <div className={`text-[10px] font-black tracking-widest uppercase ${badge.text}`}>
                   {badge.label}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="mt-6 text-[11px] uppercase tracking-widest font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-end gap-1 w-full transition-colors z-10 relative">
        View All Counties <ChevronRight className="w-4 h-4 ml-0.5" />
      </button>
    </div>
  );
}
