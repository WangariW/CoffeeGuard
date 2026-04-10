import React, { useMemo } from 'react';
import { Map, AlertTriangle, Activity, Leaf } from 'lucide-react';

export default function AlertMap({ reports = [], highRiskCount, topDisease, totalReports }) {

  // Group reports by county and compute risk levels with position mapping
  const countyPositions = {
    'Nyeri':      { x: 42, y: 28 },
    'Kirinyaga':  { x: 62, y: 45 },
    'Embu':       { x: 72, y: 58 },
    "Murang'a":   { x: 38, y: 62 },
    'Kiambu':     { x: 48, y: 82 },
    'Meru':       { x: 68, y: 22 },
    'Tharaka':    { x: 80, y: 35 },
    'Machakos':   { x: 58, y: 90 },
  };

  const pins = useMemo(() => {
    const countyMap = {};
    reports.forEach(r => {
      const c = r.county;
      if (!c) return;
      if (!countyMap[c]) countyMap[c] = { count: 0, highCount: 0 };
      countyMap[c].count++;
      if (r.severity === 'High') countyMap[c].highCount++;
    });

    return Object.entries(countyMap).map(([county, data], idx) => {
      const pos = countyPositions[county] || { x: 30 + (idx * 12) % 60, y: 30 + (idx * 15) % 50 };
      let risk = 'low';
      if (data.highCount > 0) risk = 'high';
      else if (data.count > 2) risk = 'medium';

      return {
        id: county,
        x: pos.x,
        y: pos.y,
        label: `${county} (${data.count})`,
        risk,
      };
    });
  }, [reports]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center mb-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
           <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
             <Map className="w-5 h-5" />
           </div>
           Regional Risk Visualization
        </h3>
      </div>

      <div className="bg-[#1e293b] border border-white/5 rounded-[2rem] p-6 shadow-xl flex-col flex flex-1 justify-between">
        {/* Map Canvas */}
        <div className="relative w-full aspect-[4/3] md:aspect-auto md:flex-1 bg-[#0f291e] rounded-3xl border border-emerald-900/50 overflow-hidden mb-6 flex items-center justify-center min-h-[320px]">
            {/* Abstract map shape */}
            <div className="absolute inset-4 sm:inset-10 bg-emerald-500/20 shadow-[0_0_80px_60px_rgba(16,185,129,0.15)] transition-all duration-[3000ms] hover:bg-emerald-500/30 blur-md" 
                 style={{ clipPath: 'polygon(30% 0%, 70% 20%, 100% 60%, 70% 100%, 20% 90%, 0% 50%)' }}>
            </div>
            
            <div className="absolute inset-4 sm:inset-10 bg-[#0f291e] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] transition-all duration-[3000ms]" 
                 style={{ clipPath: 'polygon(30% 0%, 70% 20%, 100% 60%, 70% 100%, 20% 90%, 0% 50%)' }}>
            </div>
            
            {/* Dynamic Pins */}
            <div className="absolute inset-4 sm:inset-10 pointer-events-none z-10 w-[70%] max-w-sm mx-auto h-[60%]">
              {pins.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500 text-sm font-bold pointer-events-auto">No outbreak data for this filter</p>
                </div>
              ) : (
                pins.map(pin => (
                   <div key={pin.id} 
                        className="absolute flex flex-col items-center pointer-events-auto cursor-pointer group hover:z-20 scale-90 sm:scale-100"
                        style={{ top: `${pin.y}%`, left: `${pin.x}%`, transform: 'translate(-50%, -50%)' }}>
                     <div className="relative">
                       {pin.risk === 'high' && <div className="absolute inset-[-4px] bg-red-500 rounded-full animate-ping opacity-30"></div>}
                       <MapPinIcon risk={pin.risk} />
                     </div>
                     <div className="mt-2 bg-[#0f172a] border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-white shadow-2xl shadow-black/50 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-all">
                        {pin.label}
                     </div>
                  </div>
                ))
              )}
            </div>

            {/* Outbreak Density Legend */}
            <div className="absolute bottom-5 left-5 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/80 z-20 scale-90 sm:scale-100 origin-bottom-left">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Outbreak Density</p>
               <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                   <div className="relative flex items-center justify-center">
                      <span className="absolute w-4 h-4 rounded-full bg-red-500/30 animate-pulse"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative z-10 border border-red-900"></span>
                   </div>
                   <span className="text-[11px] font-bold text-white">High Risk Zone</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-900 ml-[3px]"></span>
                   <span className="text-[11px] font-semibold text-slate-400">Medium Activity</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-900 ml-[3px]"></span>
                   <span className="text-[11px] font-semibold text-slate-400">Monitoring Zone</span>
                 </div>
               </div>
            </div>
        </div>

        {/* Stats Row - Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
           <div className="flex items-center gap-4 bg-red-500/[0.05] rounded-2xl p-4 border border-red-500/10 hover:border-red-500/30 transition-colors cursor-default">
             <div className="text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 shadow-inner">
               <AlertTriangle className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">High Risk Areas</p>
               <h4 className="text-2xl font-black text-white leading-none">{highRiskCount} {highRiskCount === 1 ? 'County' : 'Counties'}</h4>
             </div>
           </div>

           <div className="flex items-center gap-4 bg-emerald-500/[0.05] rounded-2xl p-4 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors cursor-default">
             <div className="text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 shadow-inner">
               <Leaf className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">Top Disease</p>
               <h4 className="text-xl font-bold text-white leading-tight capitalize">{topDisease}</h4>
             </div>
           </div>

           <div className="flex items-center gap-4 bg-white/[0.02] rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-colors cursor-default">
             <div className="text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 shadow-inner">
               <Activity className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">Total Reports</p>
               <h4 className="text-xl font-bold text-white leading-tight">{totalReports} Total</h4>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MapPinIcon({ risk }) {
  const getRiskStyles = () => {
    switch(risk) {
      case 'high': 
        return { 
          bg: 'bg-red-500', 
          border: 'border-red-900', 
          arrow: 'border-t-red-500',
          ring: 'ring-red-500/30'
        };
      case 'medium': 
        return { 
          bg: 'bg-amber-500', 
          border: 'border-amber-900', 
          arrow: 'border-t-amber-500',
          ring: 'ring-amber-500/30'
        };
      case 'low': 
        return { 
          bg: 'bg-emerald-500', 
          border: 'border-emerald-900', 
          arrow: 'border-t-emerald-500',
          ring: 'ring-emerald-500/30'
        };
      default: 
        return { 
          bg: 'bg-slate-500', 
          border: 'border-slate-800', 
          arrow: 'border-t-slate-500',
          ring: 'ring-slate-500/30'
        };
    }
  }

  const styles = getRiskStyles();
  
  return (
    <div className={`w-6 h-6 rounded-full ${styles.bg} border-2 ${styles.border} flex flex-col items-center justify-center shadow-lg ring-4 ${styles.ring} z-10 relative group-hover:scale-110 transition-transform`}>
      <div className="w-2 h-2 bg-[#0f172a] rounded-full opacity-60"></div>
      <div className={`absolute -bottom-2.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] ${styles.arrow} drop-shadow`}></div>
    </div>
  );
}
