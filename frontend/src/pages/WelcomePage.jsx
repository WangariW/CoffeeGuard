import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Leaf, 
  Camera, 
  Bell, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141615] text-[#f4f4f5] font-sans selection:bg-[#2bd47d] selection:text-black pb-0">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          {/* Replicating the dotted leaf logo */}
          <div className="flex items-center justify-center bg-[#2bd47d]/10 p-1.5 rounded-md">
            <Leaf className="text-[#2bd47d] w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CoffeeGuard</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <button onClick={() => navigate('/auth')} className="hover:text-[#2bd47d] transition-colors">Login</button>
          <button onClick={() => navigate('/auth')} className="bg-[#2bd47d] hover:bg-[#23b369] text-[#0a0a0a] px-5 py-2 rounded-full font-bold transition-all">
            Join CoffeeGuard
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-8 py-16 max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-start z-10">
            {/* Pill Badge */}
            <div className="border border-[#2bd47d]/30 bg-[#2bd47d]/5 px-3 py-1 rounded-full mb-6">
              <span className="text-[11px] font-bold text-[#2bd47d] uppercase tracking-wide">
                Powered by Advanced AI Technology
              </span>
            </div>

            {/* Title with distinctive border */}
            <div className="border-[1.5px] border-[#c4b5fd] p-4 pr-12 mb-6 rounded-sm">
              <h1 className="text-[3.5rem] leading-[1.1] font-extrabold text-white tracking-tight">
                Protect Your <br/>
                <span className="text-[#2bd47d] italic font-black">Coffee Harvest</span> <br/>
                with AI Precision
              </h1>
            </div>

            <p className="text-sm text-gray-300 max-w-[420px] leading-relaxed mb-8">
              CoffeeGuard helps Kenyan small-scale farmers detect coffee leaf rust, berry disease, and pests early. Get instant treatment guides and safeguard your livelihood.
            </p>
            
            <div className="flex gap-4">
              <button onClick={() => navigate('/auth')} className="bg-[#2bd47d] hover:bg-[#23b369] text-[#0a0a0a] px-6 py-3 rounded-full font-bold text-sm transition-all">
                Get Started Free
              </button>
              <button className="bg-transparent hover:bg-white/5 text-white px-6 py-3 rounded-full font-bold text-sm transition-all border border-gray-500">
                View Alert Map
              </button>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative w-full h-[450px] rounded-3xl overflow-hidden border border-gray-800/50 shadow-2xl">
            <img 
              src="cg2.jpeg" 
              alt="Kenyan Coffee Farmer" 
              className="w-full h-full object-cover"
            />
            {/* Dark overlay specifically at the bottom for the badge */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            {/* Floating Badge (Verified AI Analysis) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-[#1a1c1a]/95 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <ShieldCheck className="w-6 h-6 text-gray-400" />
              <div>
                <h4 className="font-bold text-white text-sm">Verified AI Analysis</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">98.4% detection accuracy for Leaf Rust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMMEDIATE ACTIONS */}
      <section className="px-8 pt-20 pb-24 flex flex-col items-center max-w-[1000px] mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-3">Immediate Actions</h2>
        <p className="text-gray-400 mb-12 text-center text-sm max-w-lg">
          Whether you're in the field or at home, CoffeeGuard provides the tools you need to stay ahead of outbreaks.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Identify Plant Disease */}
          <div className="bg-[#0f4d2f] rounded-2xl p-8 flex flex-col items-start border border-[#2bd47d]/10">
            <div className="w-12 h-12 rounded-xl bg-[#2bd47d]/20 flex items-center justify-center mb-6 border border-[#2bd47d]/30">
              <Camera className="w-6 h-6 text-[#2bd47d]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Identify Plant Disease</h3>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Upload or take a photo of a suspicious coffee leaf. Our AI will instantly identify common diseases and suggest treatment.
            </p>
            <button className="bg-[#2bd47d] text-[#0a0a0a] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#23b369] transition-all mt-auto">
              Analyze Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: View Community Alerts */}
          <div className="bg-[#5c3512] rounded-2xl p-8 flex flex-col items-start border border-[#eab308]/10">
            <div className="w-12 h-12 rounded-xl bg-[#d97706]/20 flex items-center justify-center mb-6 border border-[#d97706]/30">
              <Bell className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">View Community Alerts</h3>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Check current disease outbreaks reported by other farmers in your county. Stay informed about localized risks.
            </p>
            <button className="bg-[#a16207] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#854d0e] transition-all mt-auto">
              See Alerts <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="px-8 py-16 text-center relative max-w-[1000px] mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-3">Simple, Powerful, Farmer-First</h2>
        <p className="text-gray-400 mb-20 text-sm max-w-[500px] mx-auto">
          Built specifically for the needs of small-scale agriculture, our three-step process is easy to follow even with limited data.
        </p>
        
        <div className="relative grid grid-cols-3 gap-8">
          {/* Faint connecting line */}
          <div className="absolute top-8 left-[15%] right-[15%] h-[1px] bg-gray-700/50 -z-10"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#141615] flex items-center justify-center mb-6 border border-[#2bd47d]/30 relative z-10">
              <Camera className="w-6 h-6 text-[#2bd47d]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Take a Photo</h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Capture a clear image of any coffee leaf or berry that looks unhealthy or shows spots.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#141615] flex items-center justify-center mb-6 border border-[#2bd47d]/30 relative z-10">
              <Zap className="w-6 h-6 text-[#2bd47d]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">AI Analysis</h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Our trained AI model compares your photo against thousands of known disease cases instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#141615] flex items-center justify-center mb-6 border border-[#2bd47d]/30 relative z-10">
              <ShieldCheck className="w-6 h-6 text-[#2bd47d]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Expert Advice</h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Receive a detailed treatment plan, including organic options and contact info for county officers.
            </p>
          </div>
        </div>
      </section>

      {/* SERVING THE HEARTLANDS (Dark Green Background Section) */}
      <section className="bg-[#063f22] w-full pt-16 pb-20 px-8 mt-10">
        <div className="max-w-[1100px] mx-auto bg-[#0a4e2d] rounded-3xl p-10 lg:p-14 border border-[#2bd47d]/20 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">Serving the Coffee Heartlands</h2>
              <p className="text-gray-300 mb-8 text-sm leading-relaxed max-w-[400px]">
                We are actively monitoring plantations across Kenya's premier coffee-growing counties to ensure the heritage of our beans remains secure.
              </p>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {['Nyeri', 'Kiambu', "Murang'a", 'Kirinyaga', 'Embu', 'Meru'].map((county) => (
                  <div key={county} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#2bd47d]" />
                    <span className="text-sm font-bold text-white">{county}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="flex flex-col gap-4">
              {/* System Health */}
              <div className="bg-[#111312] border border-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">System Health</p>
                  <span className="text-white text-[10px] font-bold px-2 py-0.5 text-center items-center flex gap-1">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl font-extrabold text-white mb-1">4,821</h3>
                    <p className="text-[11px] text-gray-400">Analyses processed this week</p>
                  </div>
                  <Leaf className="w-6 h-6 text-[#2bd47d] mb-4" />
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-5">
                  <div className="bg-[#2bd47d] h-full rounded-full w-[80%]"></div>
                </div>
              </div>

              {/* Alert Status */}
              <div className="bg-[#111312] border border-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Alert Status</p>
                  <span className="text-white text-[10px] font-bold px-2 py-0.5 text-center flex items-center gap-1">
                    Moderate
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl font-extrabold text-white mb-1">12 Outbreaks</h3>
                    <p className="text-[11px] text-gray-400">Active alerts in Central Kenya</p>
                  </div>
                  <Leaf className="w-6 h-6 text-[#fbbf24] mb-4" />
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-5">
                  <div className="bg-[#fbbf24] h-full rounded-full w-[35%]"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION WITH IMAGES */}
      <section className="w-full flex flex-col">
        {/* Top Image (Farmers) */}
        <div className="w-full h-48 bg-gray-900">
          <img 
            src="cg1.jpeg" 
            alt="Coffee Farmers" 
            className="w-full h-full object-cover object-top opacity-80"
          />
        </div>

        {/* Solid Dark CTA Block */}
        <div className="w-full bg-[#111312] py-16 px-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full border border-[#2bd47d]/30 flex items-center justify-center mb-6 bg-[#2bd47d]/10">
            <ShieldCheck className="w-6 h-6 text-[#2bd47d]" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-6">Ready to protect your livelihood?</h2>
          
          <div className="border border-gray-600/50 rounded-md py-3 px-8 mb-8 max-w-[650px]">
            <p className="text-gray-300 text-sm">
              Join thousands of farmers using technology to secure the future of Kenyan coffee. Free for small-scale growers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button onClick={() => navigate('/auth')} className="bg-[#2bd47d] hover:bg-[#23b369] text-[#0a0a0a] px-8 py-3 rounded-xl font-bold transition-all">
              Join CoffeeGuard
            </button>
            <button className="bg-transparent hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition-all border border-gray-600">
              Learn More
            </button>
          </div>

          <div className="max-w-2xl mx-auto text-center pt-4">
            <p className="text-[13px] italic text-gray-300 mb-2">
              "CoffeeGuard saved my Nyeri farm during the last rains. The early warning meant I could treat my trees before the rust spread."
            </p>
            <p className="text-xs font-bold text-gray-500">— Samuel K., Coffee Farmer</p>
          </div>
        </div>

        {/* Bottom Image (Coffee Beans) */}
        <div className="w-full h-48 bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop" 
            alt="Coffee Beans" 
            className="w-full h-full object-cover object-bottom opacity-80"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#141615] px-8 pt-12 pb-8 max-w-[1200px] mx-auto border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm mb-12">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="text-[#2bd47d] w-5 h-5" />
              <span className="text-lg font-bold text-white tracking-tight">CoffeeGuard</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px] max-w-[200px]">
              Protecting Kenyan coffee heritage through AI innovation. Helping farmers in Nyeri, Kiambu, and beyond.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-xs">Resources</h4>
            <ul className="space-y-3 text-gray-400 text-[11px]">
              <li><a href="#" className="hover:text-[#2bd47d] transition-colors">Disease Guide</a></li>
              <li><a href="#" className="hover:text-[#2bd47d] transition-colors">Weather Alerts</a></li>
              <li><a href="#" className="hover:text-[#2bd47d] transition-colors">Treatment FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs">Community</h4>
            <ul className="space-y-3 text-gray-400 text-[11px]">
              <li><a href="#" className="hover:text-[#2bd47d] transition-colors">Farmer Forum</a></li>
              <li><a href="#" className="hover:text-[#2bd47d] transition-colors">Report Outbreak</a></li>
              <li><a href="#" className="hover:text-[#2bd47d] transition-colors">County Stats</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs">Connect</h4>
            <div className="flex gap-4 text-gray-400">
              {/* Facebook Inline SVG */}
              <a href="#" className="hover:text-[#2bd47d] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* Twitter/X Inline SVG */}
              <a href="#" className="hover:text-[#2bd47d] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              {/* Mail Inline SVG */}
              <a href="#" className="hover:text-[#2bd47d] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-gray-800 pt-6 text-[10px] text-gray-500">
          © 2026 CoffeeGuard. Built for the small-scale farmers of Kenya.
        </div>
      </footer>

    </div>
  );
}