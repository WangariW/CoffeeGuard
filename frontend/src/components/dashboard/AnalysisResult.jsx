import React, { useState } from 'react';
import { ChevronLeft, Search, ShieldAlert, CheckCircle2, Download, CloudLightning, Info, Scissors, FlaskConical, Sprout, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function AnalysisResult({ onBack, predictData, reportData, isAnalyzing, imagePreview, isHistoryView }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveReport = async () => {
    if (!predictData || !predictData.success || isSaved) return;
    setIsSaving(true);
    
    // For now we mock the user coordinates (Nyeri default region)
    const mockLocation = {
      type: "Point",
      coordinates: [36.95, -0.42] // [lng, lat]
    };

    try {
      await api.post('/reports/create', {
        disease: predictData.prediction?.common_name || predictData.prediction?.disease || 'Unknown',
        confidence: predictData.prediction?.confidence || 0,
        symptoms: predictData.diagnosis?.symptoms || 'Unknown symptoms',
        treatment: predictData.diagnosis?.treatment || 'General care',
        county: 'Nyeri',
        severity: predictData.prediction?.severity || 'Medium',
        location: mockLocation
      });
      setIsSaved(true);
    } catch (e) {
      console.error("Failed to save report", e);
      alert("Failed to save report.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
        <div className="w-32 h-32 relative mb-8">
           {imagePreview ? (
             <img src={imagePreview} className="w-full h-full object-cover rounded-2xl opacity-50 shadow-2xl" />
           ) : (
               <div className="w-full h-full bg-slate-800 rounded-2xl opacity-50"></div>
           )}
           <div className="absolute inset-0 border-4 border-emerald-500 rounded-2xl border-t-white animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">AI Processing...</h2>
        <p className="text-emerald-500 font-medium tracking-widest text-sm animate-pulse uppercase">Analyzing organic structures</p>
      </div>
    );
  }

  if (!isHistoryView && predictData && !predictData.success) {
      return (
          <div className="py-20 text-center">
             <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
             <p className="text-slate-400 mb-6">{predictData.error || "Unable to contact AI service."}</p>
             <button onClick={onBack} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg text-white font-bold transition">Try Again</button>
          </div>
      );
  }

  const isHealthy = isHistoryView ? reportData?.disease?.toLowerCase().includes('healthy') : (predictData?.prediction?.disease === 'healthy');
  const diseaseName = isHistoryView ? reportData?.disease : (predictData?.prediction?.common_name || "Coffee Leaf Rust");
  const scientificName = isHistoryView ? null : (predictData?.prediction?.scientific_name || "");
  const riskLevel = isHistoryView ? (reportData?.severity?.toUpperCase() || "MEDIUM") : (predictData?.prediction?.risk_level || "HIGH");
  const confidence = isHistoryView ? reportData?.confidence : (predictData?.prediction?.confidence || 98.4);
  
  const symptomsText = isHistoryView ? reportData?.symptoms : (predictData?.diagnosis?.symptoms || "Powdery orange spots on the underside of leaves.");
  const treatmentText = isHistoryView ? reportData?.treatment : (predictData?.diagnosis?.treatment || "Apply copper-based fungicide, prune affected branches.");

  // Map historical images appropriately
  let displayImage = imagePreview;
  if (isHistoryView) {
     const diseaseLower = diseaseName?.toLowerCase() || '';
     if (diseaseLower.includes('rust')) displayImage = '/infected_leaf.png';
     else if (diseaseLower.includes('berry')) displayImage = '/coffee_berry_disease.png';
     else if (diseaseLower.includes('healthy')) displayImage = 'https://images.unsplash.com/photo-1596489816654-e04f05fa3ccf?q=80&w=400&auto=format&fit=crop';
     else displayImage = '/cercospora.png';
  }

  const isHighRisk = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

  return (
    <div className="space-y-8 fade-in flex flex-col pt-2 animate-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5"
        >
          <ChevronLeft className="w-4 h-4" />
          {isHistoryView ? 'Back' : 'Back to Dashboard'}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 bg-[#1e293b] px-3 py-1.5 rounded-lg border border-white/10 tracking-widest shadow-sm">
            {isHistoryView ? `Date: ${new Date(reportData?.created_at).toLocaleDateString()}` : `Case ID: #CG-${Math.floor(Math.random() * 9000) + 1000}`}
          </span>

          {!isHistoryView && (
            <button 
               onClick={handleSaveReport}
               disabled={isSaved || isSaving || !predictData}
               className={`text-xs font-bold px-4 py-1.5 rounded-lg tracking-widest shadow-lg transition-all ${isSaved ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-400 hover:bg-emerald-300 text-[#0f172a] shadow-emerald-400/20'}`}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? 'Record Saved' : 'Save Record To DB'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Col - Image */}
        <div className="bg-[#1e293b] rounded-[2.5rem] p-3 border border-emerald-900/50 shadow-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600/30 to-transparent rounded-[3rem] blur-2xl opacity-60 z-0 transition-opacity group-hover:opacity-100 duration-500"></div>
          <div className="relative z-10 w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-800 shadow-inner">
             <img src={displayImage || "/infected_leaf.png"} alt="Analyzed Leaf" className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-110 opacity-90" />
             {!isHistoryView && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_4px_theme('colors.emerald.400')] animate-[scan_3s_ease-in-out_infinite] opacity-60"></div>
             )}
          </div>
        </div>

        {/* Right Col - Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 text-sm uppercase tracking-widest">
              <Search className={`w-4 h-4 ${!isHistoryView ? 'animate-pulse' : ''}`} /> {isHistoryView ? 'Historical Record' : 'AI Diagnosis Complete'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2 tracking-tight capitalize">{diseaseName}</h1>
            {scientificName && (
               <p className="text-slate-400 text-2xl lg:text-3xl font-medium tracking-tight">{scientificName}</p>
            )}
          </div>

          <div className={`${isHighRisk ? 'bg-red-500 border-red-600 shadow-red-500/20' : isHealthy ? 'bg-emerald-500 border-emerald-600 shadow-emerald-500/20' : 'bg-amber-500 border-amber-600 shadow-amber-500/20'} transition-colors border rounded-xl p-4 flex items-center justify-center gap-3 text-[#0f172a] shadow-lg font-black text-lg tracking-widest cursor-default`}>
            <ShieldAlert className="w-6 h-6" /> RISK LEVEL: {riskLevel}
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 shadow-inner relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-10">AI Confidence</p>
               <div className="flex items-end gap-3 text-emerald-400 relative z-10">
                 <span className="text-5xl font-extrabold tracking-tighter">{confidence}<span className="text-3xl">%</span></span>
                 <CheckCircle2 className="w-6 h-6 mb-1.5 opacity-90 text-emerald-500" />
               </div>
             </div>
             <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-10">Symptoms Modeled</p>
               <div className="flex items-center h-[52px] text-white/50 text-sm italic relative z-10 line-clamp-2">
                 "{symptomsText}"
               </div>
             </div>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4 shadow-lg">
             <div className="bg-emerald-500/10 p-3 rounded-full shrink-0 border border-emerald-500/20">
               <Info className="w-6 h-6 text-emerald-400" />
             </div>
             <p className="text-emerald-100/90 text-base leading-relaxed font-medium">
               {treatmentText}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button className="flex-[1.5] bg-emerald-400 hover:bg-emerald-300 text-[#0f172a] font-extrabold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-400/20 hover:scale-[1.02]">
               <Download className="w-5 h-5" />
               Download Report (PDF)
             </button>
             {!isHistoryView && (
               <button 
                 onClick={onBack}
                 className="flex-1 bg-transparent hover:bg-white/5 border-2 border-slate-700 hover:border-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
               >
                 Retake Photo
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
