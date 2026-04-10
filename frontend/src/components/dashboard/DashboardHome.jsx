import React, { useRef, useEffect, useState } from 'react';
import { Camera, ShieldAlert, ArrowUpRight, TrendingUp, ChevronRight, CheckCircle2, Clock, MapPin, AlertTriangle, CloudRain, Loader2, Sparkles, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function DashboardHome({ onUploadImage, onViewHistory, onViewReport }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [recentReports, setRecentReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  
  const [userCount, setUserCount] = useState(1);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [globalRes, countRes, userReportsRes] = await Promise.all([
           api.get('/reports/all'),
           api.get('/user/count'),
           api.get('/reports/user')
        ]);
        setRecentReports(globalRes.data.slice(0, 3));
        setUserCount(countRes.data?.count || 1);
        
        if (userReportsRes.data && userReportsRes.data.length > 0) {
           const sorted = [...userReportsRes.data].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
           setUserReports(sorted);
           setLatestAnalysis(sorted[0]);
        }
      } catch (e) {
        console.error("Failed to fetch reports", e);
      } finally {
        setIsLoadingReports(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const triggerInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d) ? 'Recent' : d.toLocaleDateString();
  };

  const getUserName = () => {
     if (!user || !user.email) return 'Farmer';
     return user.email.split('@')[0];
  };

  const getMockImage = (disease) => {
    if (!disease) return '/infected_leaf.png';
    const lower = disease.toLowerCase();
    if (lower.includes('rust')) return '/infected_leaf.png';
    if (lower.includes('berry')) return '/coffee_berry_disease.png';
    if (lower.includes('healthy')) return 'https://images.unsplash.com/photo-1596489816654-e04f05fa3ccf?q=80&w=400&auto=format&fit=crop';
    return '/cercospora.png';
  };

  const handleShare = async () => {
     if (!latestAnalysis) return;
     const shareData = {
       title: 'CoffeeGuard Disease Alert',
       text: `CoffeeGuard Alert: Detected ${latestAnalysis.disease} (${latestAnalysis.severity} severity, ${latestAnalysis.confidence}% confidence) in ${latestAnalysis.county}.`,
       url: window.location.href
     };

     if (navigator.share) {
       try {
         await navigator.share(shareData);
       } catch (err) {
         // User cancelled or share failed silently
         console.log('Share cancelled', err);
       }
     } else {
       // Fallback for desktop browsers without Web Share API
       navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
       setCopiedLink(true);
       setTimeout(() => setCopiedLink(false), 2000);
     }
  };

  return (
    <div className="space-y-8 fade-in flex flex-col pt-4">
      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/jpeg, image/png" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {/* Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Jambo, {getUserName()}</h1>
          <p className="text-slate-400 text-lg">
            Stay updated on the coffee health in your region.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#1e293b] px-4 py-2 rounded-full border border-white/5 shadow cursor-pointer hover:bg-slate-800 transition" onClick={() => navigate('/admin')}>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#1e293b]"></div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#1e293b]"></div>
            <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-[#1e293b]"></div>
          </div>
          <span className="text-sm text-slate-300 font-medium">+{userCount} farmers active</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnose Card */}
          <div className="bg-[#0f291e] border border-emerald-900/50 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 border-4 border-emerald-900/30 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Analyze Your Coffee Plant</h2>
              <p className="text-emerald-100/70 max-w-sm mx-auto mb-8 text-sm">
                Take a clear photo of the affected coffee leaf for instant AI disease detection and treatment advice.
              </p>
              
              <button 
                onClick={triggerInput}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <ArrowUpRight className="w-5 h-5" />
                Select Image
              </button>
              <p className="mt-4 text-xs text-emerald-500/60 font-medium">Supported: JPG, PNG</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full"></span> Latest Analysis
            </h3>
            <button onClick={onViewHistory} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">Full History</button>
          </div>

          {/* Dynamic Latest Analysis Card */}
          {!latestAnalysis ? (
             <div className="bg-[#1e293b] rounded-2xl p-8 border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
                 <Sparkles className="w-10 h-10 text-emerald-500/40 mb-3" />
                 <h4 className="text-lg font-bold text-white mb-1">No Scans Yet</h4>
                 <p className="text-sm text-slate-400 mb-4">You haven't scanned any leaves with CoffeeGuard AI.</p>
                 <button onClick={triggerInput} className="text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-emerald-400 transition-colors">Start First Scan</button>
             </div>
          ) : (
             <>
                <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/5 flex gap-5 shadow-lg">
                   <div className="w-36 h-36 rounded-xl relative overflow-hidden flex-shrink-0 bg-slate-800 border border-white/10">
                     <img src={getMockImage(latestAnalysis.disease)} alt="Disease" className="object-cover w-full h-full" />
                     {latestAnalysis.severity !== 'Low' && (
                        <div className={`absolute top-2 left-2 ${latestAnalysis.severity === 'High' ? 'bg-red-500/90' : 'bg-amber-500/90'} text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm shadow overflow-hidden`}>
                           <ShieldAlert className="w-3 h-3" /> {latestAnalysis.severity} Risk
                        </div>
                     )}
                   </div>
                   <div className="flex flex-col flex-1 justify-between py-1 pr-2">
                     <div>
                       <div className="flex justify-between items-start">
                         <div>
                           <p className="text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">Latest Detection</p>
                           <h4 className="text-2xl font-bold text-white mb-1 capitalize">{latestAnalysis.disease}</h4>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-bold text-slate-500 mb-1">Confidence Score</p>
                           <p className="text-2xl font-extrabold text-emerald-400">{latestAnalysis.confidence}%</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2 mt-2 text-sm text-slate-400 font-medium">
                         <Clock className="w-4 h-4 text-emerald-500/70" />
                         <span>{formatDate(latestAnalysis.created_at)}</span>
                       </div>
                     </div>
                     <div className="flex gap-3 mt-4">
                       <button onClick={() => onViewReport(latestAnalysis)} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 rounded-lg transition-colors text-sm">
                         Full Report
                       </button>
                       <button onClick={handleShare} className="flex-[0.5] hover:bg-white/5 text-white font-bold py-2.5 rounded-lg transition-colors text-sm border border-slate-600 flex items-center justify-center gap-2">
                         {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : 'Share Alert'}
                       </button>
                     </div>
                   </div>
                </div>

                {/* Bottom Info Grid based on latest check */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-emerald-500/50 left-0"></div>
                    <h4 className="flex items-center gap-2 font-bold text-white mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> AI Recommendation
                    </h4>
                    <p className="text-xs text-slate-400 mb-4 font-medium">Based on the detected {latestAnalysis.disease}</p>
                    
                    <div className="bg-[#0f172a] rounded-xl p-4 border border-emerald-900/30 relative overflow-hidden h-[120px]">
                      <div className="absolute -right-4 -bottom-4 opacity-5">
                          <CheckCircle2 className="w-24 h-24" />
                      </div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/30 mt-1">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white mb-1.5">Action Plan</h5>
                          <p className="text-sm text-slate-300 leading-relaxed font-medium line-clamp-3">{latestAnalysis.treatment}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col">
                     <div className="absolute top-0 w-full h-1 bg-emerald-500/50 left-0"></div>
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="flex items-center gap-2 font-bold text-white">
                         <Clock className="w-4 h-4 text-emerald-400"/> Previous Scans
                       </h4>
                       <button onClick={onViewHistory} className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300">View All</button>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                       {userReports.slice(1, 4).map(report => (
                          <div key={report.id} onClick={() => onViewReport(report)} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                             <div className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                               <p className="text-sm font-medium text-slate-300 capitalize">{report.disease}</p>
                             </div>
                             <span className="text-xs text-slate-500">{formatDate(report.created_at)}</span>
                          </div>
                       ))}
                       {userReports.length <= 1 && (
                          <p className="text-sm text-slate-500 italic mt-4">No older scans found.</p>
                       )}
                    </div>
                  </div>
                </div>
             </>
          )}

          {/* Yellow Warning */}
          <div className="bg-[#422006]/40 border border-amber-600/30 rounded-2xl p-6 flex items-start gap-4 shadow-inner">
             <div className="text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 mt-1 shadow-sm">
               <AlertTriangle className="w-5 h-5" />
             </div>
             <div>
               <h5 className="text-amber-500 font-bold mb-1.5">Early Morning Scanning Tip</h5>
               <p className="text-amber-200/80 text-sm leading-relaxed font-medium">The AI works best in natural daylight. For 100% accuracy, take photos between 7:00 AM and 10:00 AM before the sun gets too harsh.</p>
             </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-4 lg:pt-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full"></span> Quick Actions
            </h3>
          </div>

          {/* New Scan Action */}
          <button 
             onClick={triggerInput}
             className="w-full bg-emerald-400 hover:bg-emerald-300 transition-all text-[#0f172a] rounded-2xl p-5 flex items-center justify-between group shadow-lg shadow-emerald-400/10 scale-100 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
               <div className="bg-[#0f172a]/10 p-3 rounded-xl shadow-inner">
                 <Camera className="w-6 h-6" />
               </div>
               <div className="text-left">
                 <h4 className="font-bold text-lg leading-none mb-1">New Scan</h4>
                 <p className="text-[#0f172a]/70 font-bold text-xs uppercase tracking-wider">Analyze leaf now</p>
               </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Community Alerts Action */}
          <button onClick={() => navigate('/alerts')} className="w-full bg-[#1e293b] hover:bg-[#253247] border border-white/5 transition-all text-white rounded-2xl p-5 flex items-center justify-between group shadow-lg">
            <div className="flex items-center gap-4">
               <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 shadow-inner">
                 <ShieldAlert className="w-6 h-6" />
               </div>
               <div className="text-left">
                 <h4 className="font-bold text-lg leading-none mb-1">Live Alerts</h4>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Global DB reports</p>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </button>

          <div className="flex items-center justify-between pt-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full"></span> Regional DB Heatmap
            </h3>
          </div>

          {/* Map Widget */}
          <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 overflow-hidden shadow-lg cursor-pointer hover:bg-slate-800 transition" onClick={() => navigate('/alerts')}>
             <div className="flex justify-between items-center mb-3">
               <h4 className="font-bold text-white flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-emerald-400"/> Nyeri Alerts</h4>
               <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-red-500/20 flex items-center gap-1.5 shadow-inner">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse outline outline-2 outline-red-500/30"></span> Live
               </span>
             </div>
             <div className="relative rounded-xl overflow-hidden h-40 bg-[#0f172a] border border-white/10 group w-full shadow-inner">
               <img src="/regional_map.png" alt="Map" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
               <div className="absolute bottom-3 right-3 bg-[#0f172a]/95 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-xl shadow-black">
                 {recentReports.length > 0 ? `${recentReports.length} New Outbreaks` : 'No Recent Outbreaks'}
               </div>
             </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full"></span> Recent Nearby Reports
            </h3>
          </div>

          <div className="bg-[#1e293b] border border-white/5 rounded-2xl divide-y divide-white/5 shadow-lg overflow-hidden">
             {isLoadingReports ? (
                 <div className="p-8 flex justify-center text-emerald-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                 </div>
             ) : recentReports.length > 0 ? (
                 recentReports.map((report, idx) => (
                    <div onClick={() => navigate('/alerts')} key={report.id || idx} className={`p-4 flex justify-between items-center transition-colors cursor-pointer relative overflow-hidden ${report.severity === 'High' ? 'bg-red-500/[0.02] hover:bg-red-500/[0.05]' : 'hover:bg-white/[0.04]'}`}>
                        {report.severity === 'High' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_theme('colors.red.500')]"></div>
                        )}
                        <div className={report.severity === 'High' ? 'pl-3' : ''}>
                          <h5 className="text-white font-bold text-sm mb-0.5 flex items-center gap-2 capitalize">
                             {report.disease}
                             {report.severity === 'High' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                          </h5>
                          <p className="text-xs text-slate-500 font-medium">{report.county} • {formatDate(report.created_at)}</p>
                        </div>
                        <div className={`p-1.5 rounded-lg shadow-sm ${report.severity === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-400'}`}>
                           <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                 ))
             ) : (
                 <div className="p-6 text-center text-slate-400 text-sm">No recent reports found.</div>
             )}
          </div>

          {/* Weather Widget */}
          <div className="bg-gradient-to-r from-[#1e293b] to-emerald-900/30 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between mt-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent"></div>
            <div className="flex items-center gap-4 relative z-10">
              <CloudRain className="w-10 h-10 text-emerald-400 drop-shadow-md" />
              <div>
                <h4 className="text-3xl font-black text-white tracking-tight">24°C</h4>
                <p className="text-xs text-slate-300 font-medium">Scattered Showers Likely</p>
              </div>
            </div>
            <div className="text-right relative z-10 bg-[#0f172a]/50 px-3 py-2 rounded-xl border border-white/5">
               <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1">Weather</p>
               <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Good Spray</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
