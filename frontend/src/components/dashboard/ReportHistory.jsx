import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ShieldAlert, Search, Loader2, Sparkles, Filter } from 'lucide-react';
import api from '../../lib/api';

export default function ReportHistory({ onBack, onViewReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, high, medium, low
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const res = await api.get('/reports/user');
        const sorted = [...res.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setReports(sorted);
      } catch (e) {
        console.error('Failed to fetch report history', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserReports();
  }, []);

  const getMockImage = (disease) => {
    if (!disease) return '/infected_leaf.png';
    const lower = disease.toLowerCase();
    if (lower.includes('rust')) return '/infected_leaf.png';
    if (lower.includes('berry')) return '/coffee_berry_disease.png';
    if (lower.includes('healthy')) return 'https://images.unsplash.com/photo-1596489816654-e04f05fa3ccf?q=80&w=400&auto=format&fit=crop';
    return '/cercospora.png';
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d)) return 'Unknown date';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-[#0f172a]';
      case 'Low': return 'bg-emerald-500 text-[#0f172a]';
      default: return 'bg-slate-600 text-white';
    }
  };

  const filtered = reports.filter(r => {
    const matchesSeverity = filter === 'all' || r.severity?.toLowerCase() === filter;
    const matchesSearch = !searchQuery || r.disease?.toLowerCase().includes(searchQuery.toLowerCase()) || r.county?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 fade-in flex flex-col pt-2">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Scan History</h1>
            <p className="text-sm text-slate-400 font-medium">{reports.length} total scans on record</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by disease or county..."
            className="w-full bg-[#1e293b] border border-white/10 text-white text-sm font-medium rounded-xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                filter === f
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-[#1e293b] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-slate-400 font-bold">Loading your scan history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl">
          <Sparkles className="w-12 h-12 text-emerald-500/40 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">
            {reports.length === 0 ? 'No Scans Yet' : 'No Matching Reports'}
          </h3>
          <p className="text-sm text-slate-400">
            {reports.length === 0
              ? 'Upload a coffee leaf image from the dashboard to get started.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((report) => (
            <div
              key={report.id}
              onClick={() => onViewReport(report)}
              className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all cursor-pointer group relative"
            >
              {/* Severity accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                report.severity === 'High' ? 'bg-red-500' :
                report.severity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></div>

              {/* Image */}
              <div className="h-40 relative overflow-hidden bg-slate-800">
                <img
                  src={getMockImage(report.disease)}
                  alt={report.disease}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
                <div className={`absolute top-3 left-3 ${getSeverityStyle(report.severity)} text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md shadow`}>
                  {report.severity || 'Unknown'} Risk
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h4 className="text-lg font-bold text-white capitalize leading-tight group-hover:text-emerald-400 transition-colors">
                  {report.disease}
                </h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-500/60" />
                    {formatDate(report.created_at)} • {formatTime(report.created_at)}
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{report.confidence}%</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-medium text-slate-500">{report.county}</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    View Report <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
