import { useState } from 'react';
import DiseaseMap from './DiseaseMap';
function Dashboard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data
  const recentReports = [
    { disease: 'Berry Disease', location: 'Nyeri', time: '2h ago', risk: 'medium' },
    { disease: 'Leaf Rust', location: 'Nyeri', time: '5h ago', risk: 'high' },
    { disease: 'Borer Beetle', location: 'Nyeri', time: 'Yesterday', risk: 'low' },
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze image. Make sure the API server is running!');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    if (level === 'HIGH' || level === 'high') return 'bg-red-500';
    if (level === 'MEDIUM' || level === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-[#0a0d0b]">
      {/* Header */}
      <header className="bg-black/40 border-b border-coffee-border px-6 py-3">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coffee-green rounded-full flex items-center justify-center">
              <span className="text-xl">🌿</span>
            </div>
            <h1 className="text-xl font-bold text-white">CoffeeGuard</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="px-4 py-2 text-coffee-green font-semibold border-b-2 border-coffee-green">
              Dashboard
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-white">
              Alerts
            </button>
            <button className="p-2 text-gray-400 hover:text-white"></button>
            <button className="p-2 text-gray-400 hover:text-white">🔔</button>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
              K
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Welcome */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Jambo, Farmer Kamau</h2>
            <p className="text-gray-400">
              Your coffee farm in <span className="text-coffee-green font-semibold">Nyeri County</span> is 85% healthy today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-coffee-bg"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-coffee-bg"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-coffee-bg"></div>
            </div>
            <span>+12 farmers active nearby</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Diagnose Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-coffee-green"></div>
                <h3 className="text-lg font-bold text-white">Diagnose Coffee Disease</h3>
              </div>

              <div className="bg-coffee-card/50 border-2 border-dashed border-coffee-border rounded-xl p-8 text-center">
                {!preview ? (
                  <>
                    <div className="w-20 h-20 bg-coffee-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📸</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Analyze Your Coffee Plant</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                      Take a clear photo of the affected coffee leaf for instant AI disease detection and treatment advice.
                    </p>
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <div className="inline-flex items-center gap-2 bg-coffee-green hover:bg-coffee-green-dark text-white font-semibold py-3 px-8 rounded-lg cursor-pointer transition">
                        <span>📥</span>
                        Select Image
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-4">Supported: JPG, PNG (Max 5MB)</p>
                  </>
                ) : (
                  <div>
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                    <div className="flex gap-3 justify-center">
                      <label>
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                        <div className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer">
                          Change
                        </div>
                      </label>
                      <button
                        onClick={analyzeImage}
                        disabled={loading}
                        className="bg-coffee-green hover:bg-coffee-green-dark disabled:bg-gray-600 text-white font-semibold py-2 px-8 rounded-lg"
                      >
                        {loading ? 'Analyzing...' : 'Analyze Now'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Analysis */}
            {result && result.success && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-coffee-green"></div>
                    <h3 className="text-lg font-bold text-white">Latest Analysis</h3>
                  </div>
                  <button className="text-coffee-green text-sm hover:underline">Full History →</button>
                </div>

                <div className="bg-coffee-card/80 border border-coffee-border rounded-xl p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Image */}
                    <div className="relative">
                      <span className={`absolute top-2 left-2 ${getRiskBadge(result.prediction.risk_level)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
                        {result.prediction.risk_level} Risk
                      </span>
                      <img 
                        src={preview} 
                        alt="Analyzed" 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>

                    {/* Detection Info */}
                    <div className="col-span-2">
                      <div className="mb-3">
                        <span className="text-coffee-green text-xs font-bold uppercase">Latest Detection</span>
                        <h4 className="text-2xl font-bold text-white mt-1">{result.prediction.common_name}</h4>
                        <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                          <span>🕒</span> Analyzed Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </div>

                      <div className="flex gap-3 mb-4">
                        <button className="flex-1 bg-coffee-green hover:bg-coffee-green-dark text-white font-semibold py-2 rounded-lg text-sm">
                          Full Report
                        </button>
                        <button className="flex-1 bg-coffee-card border border-coffee-border hover:bg-coffee-border text-white font-semibold py-2 rounded-lg text-sm">
                          Share Alert
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Confidence Score</span>
                        <span className="text-coffee-green font-bold text-xl">{result.prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations & Next Steps */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {/* AI Recommendation */}
                    <div className="bg-coffee-bg/50 border border-emerald-900/50 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <h5 className="text-white font-bold text-sm mb-1">AI Recommendation</h5>
                          <p className="text-gray-400 text-xs">Based on the detected {result.prediction.disease} infection</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-emerald-900/30 rounded p-3">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🧪</span>
                            <div>
                              <p className="text-white text-xs font-semibold mb-1">Targeted Fungicide</p>
                              <p className="text-gray-400 text-xs">{result.diagnosis.treatment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-coffee-bg/50 border border-coffee-border rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <h5 className="text-white font-bold text-sm">Next Steps</h5>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-coffee-green text-xs font-bold mb-1">SCHEDULE REMINDER</p>
                          <p className="text-gray-300 text-xs">Re-scan in 5 days to track treatment progress.</p>
                          <button className="text-coffee-green text-xs mt-1 hover:underline">Set Reminder</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Early Morning Tip - Always visible on left */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-yellow-400 text-xs font-bold mb-1">Early Morning Scanning Tip</p>
                  <p className="text-gray-300 text-xs">The AI works best in natural daylight. For 100% accuracy, take photos between 7:00 AM and 10:00 AM before the sun gets too harsh.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Quick Actions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-coffee-green"></div>
                <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-coffee-green hover:bg-coffee-green-dark text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">New Scan</p>
                      <p className="text-xs opacity-90">Analyze leaf now</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition">→</span>
                </button>

                <button className="w-full bg-coffee-card/80 border border-coffee-border hover:bg-coffee-card text-white font-semibold py-4 px-5 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔔</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Community Alerts</p>
                      <p className="text-xs text-gray-400">View regional reports</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition">→</span>
                </button>
              </div>
            </div>

            {/* Regional Health */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-coffee-green"></div>
                <h3 className="text-lg font-bold text-white">Regional Health</h3>
              </div>

              <div className="bg-coffee-card/80 border border-coffee-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span className="text-white font-semibold text-sm">Nyeri County Alerts</span>
                  </div>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Live</span>
                </div>

                {/* Mock Map */}
                <div className="mb-3">
                    <DiseaseMap />
                </div>

                <button className="w-full text-coffee-green text-sm hover:underline text-left flex items-center justify-between">
                  <span>View County Details</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Recent Nearby Reports */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-coffee-green"></div>
                <h3 className="text-lg font-bold text-white">Recent Nearby Reports</h3>
              </div>

              <div className="space-y-2">
                {recentReports.map((report, idx) => (
                  <button
                    key={idx}
                    className="w-full bg-coffee-card/80 border border-coffee-border hover:bg-coffee-card text-white py-3 px-4 rounded-lg flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${getRiskBadge(report.risk)}`}></span>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{report.disease}</p>
                        <p className="text-xs text-gray-400">{report.location} • {report.time}</p>
                      </div>
                    </div>
                    <span className="group-hover:translate-x-1 transition text-gray-400">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-coffee-card/80 border border-coffee-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">🌤️ Weather</span>
                <span className="text-xs text-gray-400">Nyeri County</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">24°C</p>
                  <p className="text-xs text-gray-400">Scattered Showers Likely</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Spray Conditions</p>
                  <p className="text-sm font-semibold text-green-400">Good</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-coffee-border mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-coffee-green rounded-full flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
                <span className="text-white font-bold">CoffeeGuard</span>
              </div>
              <p className="text-gray-400 text-sm">
                Protecting Kenyan coffee heritage through AI innovation. Helping farmers in Nyeri, Kiambu, and beyond.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-coffee-green">Disease Guide</a></li>
                <li><a href="#" className="hover:text-coffee-green">Weather Alerts</a></li>
                <li><a href="#" className="hover:text-coffee-green">Treatment FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-coffee-green">Farmer Forum</a></li>
                <li><a href="#" className="hover:text-coffee-green">Report Outbreak</a></li>
                <li><a href="#" className="hover:text-coffee-green">County Stats</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-coffee-green text-xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-coffee-green text-xl">🐦</a>
                <a href="#" className="text-gray-400 hover:text-coffee-green text-xl">✉️</a>
              </div>
            </div>
          </div>

          <div className="border-t border-coffee-border mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">© 2026 CoffeeGuard. Built for the small-scale farmers of Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;