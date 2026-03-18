import { Camera, Bell, Zap, Shield, Leaf, CheckCircle, Facebook, Twitter, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const counties = [
    { name: 'Nyeri', checked: true },
    { name: 'Kiambu', checked: true },
    { name: "Murang'a", checked: true },
    { name: 'Kirinyaga', checked: false },
    { name: 'Embu', checked: true },
    { name: 'Meru', checked: false }
  ];

  return (
    <div className="min-h-screen bg-[#0a0d0b]">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">CoffeeGuard</span>
            </div>

            {/* Nav Items */}
            <div className="flex items-center gap-4">
              <button className="text-gray-300 hover:text-white transition p-2">
                <Shield size={20} />
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-300 hover:text-white transition px-4 py-2"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Join CoffeeGuard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <p className="text-green-500 text-sm mb-6 tracking-wide">Powered by Advanced AI Technology</p>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Protect Your <br/>
              <span className="text-green-500 italic">Coffee Harvest</span><br/>
              with AI Precision
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              CoffeeGuard helps Kenyan small-scale farmers detect coffee leaf rust, berry disease, and pests early. Get instant treatment guides and safeguard your livelihood.
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/auth')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                View Alert Map
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-900/20 to-transparent rounded-2xl overflow-hidden border border-green-500/20">
              <img 
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=400&fit=crop" 
                alt="Kenyan coffee farmer"
                className="w-full h-full object-cover"
              />
              
              {/* Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <Shield className="text-green-500" size={24} />
                  <div>
                    <p className="text-white font-semibold">Verified AI Analysis</p>
                    <p className="text-gray-400 text-sm">98.4% detection accuracy for Leaf Rust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immediate Actions Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Immediate Actions</h2>
          <p className="text-gray-400 text-lg">
            Whether you're in the field or at home, CoffeeGuard provides the tools you<br/>
            need to stay ahead of outbreaks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identify Plant Disease Card */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-900/10 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Camera className="text-green-500" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Identify Plant Disease</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Upload or take a photo of a suspicious coffee leaf. Our AI will instantly identify common diseases and suggest treatment.
            </p>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              Analyze Now 
              <span>→</span>
            </button>
          </div>

          {/* View Community Alerts Card */}
          <div className="bg-gradient-to-br from-orange-900/40 to-orange-900/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-500/50 transition">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Bell className="text-orange-500" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">View Community Alerts</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Check current disease outbreaks reported by other farmers in your county. Stay informed about localized risks.
            </p>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              See Alerts 
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Powerful, Farmer-First</h2>
          <p className="text-gray-400 text-lg">
            Built specifically for the needs of small-scale agriculture, our three-step<br/>
            process is easy to follow even with limited data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-green-900/40 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Take a Photo</h3>
            <p className="text-gray-400 leading-relaxed">
              Capture a clear image of any coffee leaf or berry that looks unhealthy or shows spots.
            </p>
          </div>

          {/* Connector Line */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-green-500/50 to-green-500/50"></div>
          </div>

          {/* Step 2 */}
          <div className="text-center md:col-start-2">
            <div className="w-20 h-20 bg-green-900/40 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Analysis</h3>
            <p className="text-gray-400 leading-relaxed">
              Our trained AI model compares your photo against thousands of known disease cases instantly.
            </p>
          </div>

          {/* Connector Line */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-green-500/50 to-green-500/50"></div>
          </div>

          {/* Step 3 */}
          <div className="text-center md:col-start-3">
            <div className="w-20 h-20 bg-green-900/40 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Expert Advice</h3>
            <p className="text-gray-400 leading-relaxed">
              Receive a detailed treatment plan, including organic options and contact info for county officers.
            </p>
          </div>
        </div>
      </section>

      {/* Serving Counties Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-green-900/30 to-transparent border border-green-500/20 rounded-2xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Serving the Coffee Heartlands</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                We are actively monitoring plantations across Kenya's premier coffee-growing counties to ensure the heritage of our beans remains secure.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {counties.map((county, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className={county.checked ? "text-green-500" : "text-gray-600"} size={20} />
                    <span className="text-gray-300">{county.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Stats Cards */}
            <div className="space-y-4">
              {/* System Health Card */}
              <div className="bg-black/40 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">SYSTEM HEALTH</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Online</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">4,821</div>
                <p className="text-gray-400 text-sm mb-3">Analyses processed this week</p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              {/* Alert Status Card */}
              <div className="bg-black/40 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-medium">ALERT STATUS</span>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">Moderate</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  12 Outbreaks 
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">Active alerts in Central Kenya</p>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=400&fit=crop" 
            alt="Coffee beans"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d0b]/80 via-[#0a0d0b]/90 to-[#0a0d0b]"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Shield className="text-green-500 mx-auto mb-6" size={48} />
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to protect your livelihood?
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 border-2 border-gray-600 rounded-lg py-4 px-6 inline-block">
            Join thousands of farmers using technology to secure the future of Kenyan coffee.<br/>
            Free for small-scale growers.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <button 
              onClick={() => navigate('/auth')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Join CoffeeGuard
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Learn More
            </button>
          </div>

          {/* Testimonial */}
          <p className="text-gray-400 italic text-sm">
            "CoffeeGuard saved my Nyeri farm during the last rains. The early warning meant I could treat my trees before the rust spread."
          </p>
          <p className="text-gray-500 text-sm mt-2">— Samuel K., Coffee Farmer</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Leaf className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold text-white">CoffeeGuard</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Protecting Kenyan coffee heritage through AI innovation, helping farmers in Nyeri, Kiambu, and beyond.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Disease Guide</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Weather Alerts</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Treatment FAQ</a></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Farmer Forum</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Report Outbreak</a></li>
                <li><a href="#" className="hover:text-green-500 transition">County Stats</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2026 CoffeeGuard. Built for the small-scale farmers of Kenya.
          </div>
        </div>
      </footer>
    </div>
  );
}