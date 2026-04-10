import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import AnalysisResult from '../components/dashboard/AnalysisResult';
import ReportHistory from '../components/dashboard/ReportHistory';
import api from '../lib/api';

export default function Dashboard() {
  const [viewState, setViewState] = useState('home'); // home, scanning, history, report_detail
  const [previousView, setPreviousView] = useState('home'); // tracks where we came from
  const [predictionData, setPredictionData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleUploadImage = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setPreviousView('home');
    setViewState('scanning');
    setAnalyzing(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/ai/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPredictionData(response.data);
    } catch (error) {
      console.error('AI Prediction error:', error);
      setPredictionData({ success: false, error: error.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBackToDashboard = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewState('home');
    setPreviousView('home');
    setPredictionData(null);
    setSelectedImage(null);
    setSelectedReport(null);
  };

  const handleBackFromDetail = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Go back to wherever the user came from
    setViewState(previousView);
    setSelectedReport(null);
  };

  const navigateTo = (target, from) => {
    setPreviousView(from || viewState);
    setViewState(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (viewState) {
       case 'scanning':
         return (
           <AnalysisResult 
             onBack={handleBackToDashboard} 
             predictData={predictionData} 
             isAnalyzing={analyzing} 
             imagePreview={selectedImage}
           />
         );
       case 'report_detail':
         return (
           <AnalysisResult 
             onBack={handleBackFromDetail}
             reportData={selectedReport}
             isHistoryView={true}
           />
         );
       case 'history':
         return (
           <ReportHistory 
             onBack={handleBackToDashboard}
             onViewReport={(report) => {
               setSelectedReport(report);
               navigateTo('report_detail', 'history');
             }}
           />
         );
       case 'home':
       default:
         return (
           <DashboardHome 
             onUploadImage={handleUploadImage}
             onViewHistory={() => navigateTo('history', 'home')}
             onViewReport={(report) => {
               setSelectedReport(report);
               navigateTo('report_detail', 'home');
             }}
           />
         );
    }
  };

  return (
    <DashboardLayout>
      {renderView()}
    </DashboardLayout>
  );
}
