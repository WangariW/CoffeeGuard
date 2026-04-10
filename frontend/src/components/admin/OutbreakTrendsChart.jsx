import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

export default function OutbreakTrendsChart({ reports = [] }) {
  
  // Group reports by disease type and build trend data
  const { diseaseGroups, dateLabels } = useMemo(() => {
    if (reports.length === 0) return { diseaseGroups: {}, dateLabels: [] };

    // Sort reports by date
    const sorted = [...reports].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    // Get date range
    const earliest = new Date(sorted[0].created_at);
    const latest = new Date(sorted[sorted.length - 1].created_at);
    
    // Create 7 time buckets
    const range = latest - earliest || 86400000; // at least 1 day
    const bucketSize = range / 6;
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(earliest.getTime() + bucketSize * i);
      return d;
    });

    const dateLabels = buckets.map(d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));

    // Count diseases per bucket
    const diseases = {};
    sorted.forEach(r => {
      const dName = r.disease || 'Unknown';
      if (!diseases[dName]) diseases[dName] = new Array(7).fill(0);
      
      const reportDate = new Date(r.created_at);
      // Find which bucket this falls into
      let bucketIdx = Math.floor((reportDate - earliest) / bucketSize);
      bucketIdx = Math.min(bucketIdx, 6);
      diseases[dName][bucketIdx]++;
    });

    return { diseaseGroups: diseases, dateLabels };
  }, [reports]);

  // Get the top 2 diseases for the chart lines
  const sortedDiseases = Object.entries(diseaseGroups)
    .map(([name, counts]) => ({ name, counts, total: counts.reduce((s, c) => s + c, 0) }))
    .sort((a, b) => b.total - a.total);

  const primary = sortedDiseases[0];
  const secondary = sortedDiseases[1];

  // Convert counts to SVG path
  const countsToPath = (counts, maxVal) => {
    if (!counts || maxVal === 0) return '';
    const points = counts.map((c, i) => {
      const x = (i / 6) * 1000;
      const y = 300 - (c / maxVal) * 280;
      return `${x},${y}`;
    });
    return `M${points.join(' L')}`;
  };

  const countsToArea = (counts, maxVal) => {
    const linePath = countsToPath(counts, maxVal);
    if (!linePath) return '';
    return `${linePath} L1000,300 L0,300 Z`;
  };

  const maxVal = Math.max(
    ...(primary?.counts || [0]),
    ...(secondary?.counts || [0]),
    1
  );

  return (
    <div className="bg-[#1e293b] border border-white/5 rounded-[2rem] p-8 shadow-xl h-[420px] flex flex-col relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Disease Outbreak Trends</h3>
          <p className="text-sm text-slate-400 font-medium">
            {reports.length > 0 
              ? `${reports.length} reports across ${new Set(reports.map(r => r.county)).size} counties`
              : 'No report data available yet.'}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f172a] border border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors shadow-inner">
          <Calendar className="w-4 h-4" /> All Time
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-bold">
          No data to visualize
        </div>
      ) : (
        <>
          {/* Chart Area */}
          <div className="flex-1 relative w-full border-b border-l border-white/10 ml-6 sm:ml-8 mb-8 mt-2">
            {/* Y-Axis Labels */}
            <div className="absolute -left-8 sm:-left-10 top-0 bottom-0 w-8 flex flex-col justify-between text-[11px] font-bold text-slate-500 py-0">
              <span>{maxVal}</span>
              <span>{Math.round(maxVal * 0.75)}</span>
              <span>{Math.round(maxVal * 0.5)}</span>
              <span>{Math.round(maxVal * 0.25)}</span>
              <span>0</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
              {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-white/5"></div>)}
            </div>

            {/* Chart SVG */}
            <svg className="absolute inset-0 w-full h-[calc(100%+1px)] z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
               {/* Secondary disease area + line */}
               {secondary && (
                 <>
                   <path d={countsToArea(secondary.counts, maxVal)} fill="url(#amber-gradient)" className="opacity-30 hover:opacity-50 transition-opacity duration-500" />
                   <path d={countsToPath(secondary.counts, maxVal)} fill="none" stroke="#d97706" strokeWidth="3" />
                 </>
               )}
               
               {/* Primary disease area + line */}
               {primary && (
                 <>
                   <path d={countsToArea(primary.counts, maxVal)} fill="url(#emerald-gradient)" className="opacity-40 hover:opacity-70 transition-opacity duration-500" />
                   <path d={countsToPath(primary.counts, maxVal)} fill="none" stroke="#10b981" strokeWidth="4" style={{ filter: 'drop-shadow(0 10px 10px rgba(16,185,129,0.3))' }} />
                 </>
               )}
               
               <defs>
                 <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                 </linearGradient>
                 <linearGradient id="amber-gradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                 </linearGradient>
               </defs>
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[11px] font-bold text-slate-500 px-1 pt-2">
              {dateLabels.map((label, i) => <span key={i}>{label}</span>)}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 relative z-10 pt-2">
             {primary && (
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-[0_0_10px_theme('colors.emerald.500')]"></div>
                 <span className="text-xs font-bold text-white tracking-widest uppercase capitalize">{primary.name}</span>
               </div>
             )}
             {secondary && (
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-amber-600 rounded-sm"></div>
                 <span className="text-xs font-bold text-slate-400 tracking-widest uppercase capitalize">{secondary.name}</span>
               </div>
             )}
          </div>
        </>
      )}
    </div>
  );
}
