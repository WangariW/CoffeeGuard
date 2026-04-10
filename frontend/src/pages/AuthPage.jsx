import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  Settings, 
  Mail, 
  Lock, 
  User, 
  MapPin,
  Bell,
  CheckCircle2,
  ArrowRight,
  Shield,
  LogOut,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { requestOtp, login, logout, isAuthenticated } = useAuth();

  // Flow states: 'email' -> 'otp'
  const [authStep, setAuthStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Auto redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const res = await requestOtp(email);
    if (res.success) {
      setAuthStep('otp');
    } else {
      setErrorMsg(res.message);
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const res = await login(email, otp);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#141615] text-[#f4f4f5] font-sans selection:bg-[#2bd47d] selection:text-black flex flex-col relative overflow-hidden">
      
      {/* Background Pattern/Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop" 
          alt="Coffee Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#141615]/80 backdrop-blur-sm"></div>
      </div>

      {/* Top Nav */}
      <div className="relative z-10 px-8 py-6 w-full max-w-[1400px] mx-auto flex justify-between items-center">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-[#2bd47d] transition-colors font-medium text-sm"
        >
          <Leaf className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-8">
        
        {/* The Auth Card */}
        <div className="w-full max-w-[420px] bg-[#1a1c1a]/95 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          
          {/* Top Green Accent Line */}
          <div className="w-full h-1 bg-gray-800">
            <div 
              className="h-full bg-[#2bd47d] transition-all duration-700 ease-in-out"
              style={{ 
                width: authStep === 'email' ? '33%' : authStep === 'otp' ? '66%' : '100%' 
              }}
            ></div>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors" />
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center bg-[#2bd47d]/10 p-1.5 rounded-md mb-2">
                  <Leaf className="text-[#2bd47d] w-6 h-6" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">CoffeeGuard</span>
              </div>
              <div className="w-5 h-5"></div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-white mb-2">
                {authStep === 'onboarding' && 'Complete Profile'}
                {authStep === 'authenticated' && 'Welcome Back'}
                {(authStep === 'email' || authStep === 'otp') && 'Access Your Account'}
              </h2>
              <p className="text-sm text-gray-400">
                {authStep === 'email' && 'Enter your email address to receive a secure login code.'}
                {authStep === 'otp' && `We sent a 6-digit code to ${email || 'your email'}.`}
                {authStep === 'onboarding' && 'Welcome! Let\'s get your profile set up.'}
                {authStep === 'authenticated' && 'Your session is active and secure.'}
              </p>
            </div>

            {/* Step 1: Email Input */}
            {authStep === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      disabled={isLoading}
                      className="w-full bg-[#111312] border border-gray-700 focus:border-[#2bd47d] rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2bd47d] transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#2bd47d] hover:bg-[#23b369] text-[#0a0a0a] py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending Code...</>
                  ) : (
                    <>Send OTP Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Input */}
            {authStep === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Secure Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      disabled={isLoading}
                      className="w-full bg-[#111312] border border-gray-700 focus:border-[#2bd47d] rounded-lg py-3 pl-10 pr-4 text-center tracking-[1em] font-mono text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2bd47d] transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || otp.length < 6}
                  className="w-full bg-[#2bd47d] hover:bg-[#23b369] text-[#0a0a0a] py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setAuthStep('email')} 
                    disabled={isLoading}
                    className="text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Wrong email? Go back
                  </button>
                </div>
              </form>
            )}


            {/* Step 4: Authenticated Success State */}
            {authStep === 'authenticated' && (
              <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-[#2bd47d]/10 rounded-full flex items-center justify-center border border-[#2bd47d]/30 mb-6 shadow-[0_0_15px_rgba(43,212,125,0.2)]">
                  <CheckCircle2 className="w-8 h-8 text-[#2bd47d]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6">Authentication Successful</h3>
                
                <button 
                  onClick={() => navigate('/dashboard')}
                  disabled={isLoading}
                  className="w-full bg-[#2bd47d] hover:bg-[#23b369] text-[#0a0a0a] py-3 rounded-lg font-bold text-sm transition-all mb-3 disabled:opacity-70"
                >
                  Go to Dashboard
                </button>
                
                <button 
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full bg-transparent border border-gray-700 hover:bg-[#1f2120] hover:border-gray-500 text-white py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 text-gray-400" />
                  )}
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            )}

            {/* Footer Text (Hidden in Authenticated state) */}
            {authStep !== 'authenticated' && (
              <>
                <div className="mt-8 pt-6 border-t border-gray-800 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Your data is secured by industry-standard encryption. By continuing, you agree to CoffeeGuard's <a href="#" className="text-[#2bd47d] hover:underline">Terms of Service</a>.
                  </p>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-[11px] text-gray-500 font-medium">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="mt-16 w-full max-w-[800px] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#0f4d2f] border border-[#2bd47d]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#2bd47d]/10">
              <Leaf className="w-5 h-5 text-[#2bd47d]" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">AI Diagnosis</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">Instant identification of coffee leaf rust and berry borer diseases.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#5c3512] border border-[#d97706]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#d97706]/10">
              <Bell className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Community Alerts</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">Receive real-time notifications about outbreaks in your county.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#0c315c] border border-[#3b82f6]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#3b82f6]/10">
              <CheckCircle2 className="w-5 h-5 text-[#60a5fa]" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Expert Advice</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">Get certified treatment recommendations tailored to Kenyan soil.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-[10px] text-gray-600">
          © 2026 CoffeeGuard AI. Supporting Kenyan coffee heritage.
        </div>
      </div>
    </div>
  );
}