import { useState } from 'react';
import { User, MapPin, Mail, Lock, ArrowLeft, Shield, Leaf, Bell, HelpCircle } from 'lucide-react';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    county: '',
    email: '',
    password: ''
  });

  const counties = [
    'Nyeri',
    'Kiambu',
    'Kirinyaga',
    'Murang\'a',
    'Embu',
    'Meru',
    'Tharaka Nithi'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Will connect to backend later
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0a0d0b] relative overflow-hidden">
      {/* Coffee leaf background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-green-500 text-9xl">🍃</div>
        <div className="absolute top-40 right-20 text-green-500 text-7xl rotate-45">🍃</div>
        <div className="absolute bottom-20 left-1/4 text-green-500 text-8xl -rotate-12">🍃</div>
        <div className="absolute bottom-40 right-1/3 text-green-500 text-6xl rotate-90">🍃</div>
      </div>

      {/* Back to Home */}
      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="flex items-center gap-2 text-green-500 hover:text-green-400 transition">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-[#1C221E] border border-[#313A34] rounded-2xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">CoffeeGuard</h1>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Join the Community</h2>
              <p className="text-gray-400 text-sm">Connect with farmers and protect your harvest.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-[#0a0d0b] rounded-lg p-1">
              <button
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2.5 rounded-md font-medium transition ${
                  isRegister 
                    ? 'bg-[#1C221E] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2.5 rounded-md font-medium transition ${
                  !isRegister 
                    ? 'bg-[#1C221E] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full bg-[#0a0d0b] border border-[#313A34] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* County */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                      County
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                      <select
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        className="w-full bg-[#0a0d0b] border border-[#313A34] rounded-lg pl-10 pr-10 py-3 text-white appearance-none focus:outline-none focus:border-green-500 transition cursor-pointer"
                        required
                      >
                        <option value="" className="bg-[#1C221E]">Select your county</option>
                        {counties.map(county => (
                          <option key={county} value={county} className="bg-[#1C221E]">
                            {county}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email or Phone */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                  Email or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="0712 345 678 or farmer@email.com"
                    className="w-full bg-[#0a0d0b] border border-[#313A34] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0d0b] border border-[#313A34] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-lg transition flex items-center justify-center gap-2 mt-6"
              >
                {isRegister ? 'Create Account' : 'Login'}
                <span>→</span>
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 flex items-start gap-2 text-xs text-gray-400 bg-[#0a0d0b] border border-[#313A34] rounded-lg p-3">
              <Shield size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p>
                Your data is secured by industry-standard encryption. By continuing, you agree to CoffeeGuard's{' '}
                <a href="#" className="text-green-500 hover:underline">Terms of Service</a>.
              </p>
            </div>

            {/* Footer Links */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-green-500 transition">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-green-500 transition">Help Center</a>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {/* AI Diagnosis */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="text-green-500" size={24} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">AI Diagnosis</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Instant identification of coffee leaf rust and berry borer diseases.
              </p>
            </div>

            {/* Community Alerts */}
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Community Alerts</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Receive real-time notifications about outbreaks in your county.
              </p>
            </div>

            {/* Expert Advice */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="text-blue-500" size={24} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Expert Advice</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Get certified expert recommendations tailored to Kenyan soil.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 text-xs text-gray-500">
            © 2026 CoffeeGuard AI. Supporting Kenyan coffee heritage.
          </div>
        </div>
      </div>
    </div>
  );
}