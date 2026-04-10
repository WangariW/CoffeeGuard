import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Filter, Layers } from 'lucide-react';

// Fix default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


// Custom colored marker icons
const createDiseaseIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Disease colors
const diseaseColors = {
  rust: '#ef4444',        // Red
  cercospora: '#f97316',  // Orange
  phoma: '#8b5cf6',       // Purple
  miner: '#eab308',       // Yellow
  healthy: '#10b981'      // Green
};

// Mock disease data (sample reports from Nyeri County)
const mockDiseaseReports = [
  {
    id: 1,
    disease: 'rust',
    location: { lat: -0.4197, lng: 36.9570 }, // Nyeri town
    farmer: 'John Kamau',
    date: '2026-03-12',
    confidence: 98.5,
    severity: 'High'
  },
  {
    id: 2,
    disease: 'cercospora',
    location: { lat: -0.4350, lng: 36.9450 },
    farmer: 'Mary Wanjiku',
    date: '2026-03-11',
    confidence: 95.2,
    severity: 'Medium'
  },
  {
    id: 3,
    disease: 'rust',
    location: { lat: -0.4100, lng: 36.9700 },
    farmer: 'Peter Mwangi',
    date: '2026-03-12',
    confidence: 100,
    severity: 'High'
  },
  {
    id: 4,
    disease: 'phoma',
    location: { lat: -0.4250, lng: 36.9600 },
    farmer: 'Grace Njeri',
    date: '2026-03-10',
    confidence: 89.3,
    severity: 'Low'
  },
  {
    id: 5,
    disease: 'miner',
    location: { lat: -0.4400, lng: 36.9520 },
    farmer: 'David Kariuki',
    date: '2026-03-11',
    confidence: 92.7,
    severity: 'Medium'
  },
  {
    id: 6,
    disease: 'rust',
    location: { lat: -0.4150, lng: 36.9650 },
    farmer: 'Susan Wambui',
    date: '2026-03-13',
    confidence: 97.1,
    severity: 'High'
  },
  {
    id: 7,
    disease: 'cercospora',
    location: { lat: -0.4300, lng: 36.9480 },
    farmer: 'James Githinji',
    date: '2026-03-09',
    confidence: 88.9,
    severity: 'Low'
  },
  {
    id: 8,
    disease: 'healthy',
    location: { lat: -0.4280, lng: 36.9620 },
    farmer: 'Ann Wangari',
    date: '2026-03-13',
    confidence: 99.5,
    severity: 'None'
  }
];

// Heat Map Layer Component
function HeatMapLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.L || !window.L.heatLayer) return;

    const heatLayer = window.L.heatLayer(data, {
      radius: 25,
      blur: 35,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#10b981',
        0.3: '#eab308',
        0.6: '#f97316',
        1.0: '#ef4444'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data]);

  return null;
}

export default function DiseaseMap() {
  const [selectedDisease, setSelectedDisease] = useState('all');
  const [showHeatMap, setShowHeatMap] = useState(false);
  
    // Load Leaflet.heat plugin
  useEffect(() => {
    if (!window.L?.heatLayer) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);


  // Center on Nyeri, Kenya
  const center = [-0.4197, 36.9570];
  const zoom = 13;

  const getDiseaseName = (disease) => {
    const names = {
      rust: 'Coffee Leaf Rust',
      cercospora: 'Cercospora Leaf Spot',
      phoma: 'Phoma Leaf Spot',
      miner: 'Coffee Leaf Miner',
      healthy: 'Healthy'
    };
    return names[disease] || disease;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter reports based on selected disease
  const filteredReports = selectedDisease === 'all' 
    ? mockDiseaseReports 
    : mockDiseaseReports.filter(r => r.disease === selectedDisease);

  // Prepare heat map data
  const heatMapData = mockDiseaseReports.map(report => [
    report.location.lat,
    report.location.lng,
    report.severity === 'High' ? 1.0 : report.severity === 'Medium' ? 0.6 : 0.3
  ]);

  // Disease filter buttons
  const diseaseFilters = [
    { value: 'all', label: 'All', color: '#6B7280' },
    { value: 'rust', label: 'Rust', color: diseaseColors.rust },
    { value: 'cercospora', label: 'Cercospora', color: diseaseColors.cercospora },
    { value: 'phoma', label: 'Phoma', color: diseaseColors.phoma },
    { value: 'miner', label: 'Miner', color: diseaseColors.miner },
    { value: 'healthy', label: 'Healthy', color: diseaseColors.healthy }
  ];

  return (
    <div className="relative">
      {/* Filter Controls */}
      <div className="mb-3 space-y-2">
        {/* Disease Type Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400" />
          {diseaseFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setSelectedDisease(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                selectedDisease === filter.value
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: filter.color }}
              ></div>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Heat Map Toggle */}
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-gray-400" />
          <button
            onClick={() => setShowHeatMap(!showHeatMap)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              showHeatMap
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {showHeatMap ? 'Hide Heat Map' : 'Show Heat Map'}
          </button>
          <span className="text-xs text-gray-500">
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-64 rounded-lg z-0"
        style={{ height: '256px' }}
      >
        {/* Base map layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show markers only if heat map is off */}
        {!showHeatMap && filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createDiseaseIcon(diseaseColors[report.disease])}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-gray-900 mb-1">
                  {getDiseaseName(report.disease)}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div>Farmer: {report.farmer}</div>
                  <div>Date: {formatDate(report.date)}</div>
                  <div>Confidence: {report.confidence}%</div>
                  <div>Severity: 
                    <span className={`ml-1 font-medium ${
                      report.severity === 'High' ? 'text-red-600' :
                      report.severity === 'Medium' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>

            {/* Optional: Circle around high-severity cases */}
            {report.severity === 'High' && (
              <Circle
                center={[report.location.lat, report.location.lng]}
                radius={500}
                pathOptions={{
                  color: diseaseColors[report.disease],
                  fillColor: diseaseColors[report.disease],
                  fillOpacity: 0.1,
                  weight: 2,
                  opacity: 0.4
                }}
              />
            )}
          </Marker>
        ))}

        {/* Heat Map Layer */}
        {showHeatMap && <HeatMapLayer data={heatMapData} />}
      </MapContainer>

      {/* Map Legend - Only show when not in heat map mode */}
      {!showHeatMap && (
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur rounded-lg p-2 text-xs z-10 shadow-lg">
          <div className="font-semibold text-gray-900 mb-1">Disease Types</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: diseaseColors.rust }}></div>
              <span className="text-gray-700">Rust</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: diseaseColors.cercospora }}></div>
              <span className="text-gray-700">Cercospora</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: diseaseColors.phoma }}></div>
              <span className="text-gray-700">Phoma</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: diseaseColors.miner }}></div>
              <span className="text-gray-700">Miner</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: diseaseColors.healthy }}></div>
              <span className="text-gray-700">Healthy</span>
            </div>
          </div>
        </div>
      )}

      {/* Heat Map Legend */}
      {showHeatMap && (
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur rounded-lg p-2 text-xs z-10 shadow-lg">
          <div className="font-semibold text-gray-900 mb-1">Outbreak Density</div>
          <div className="space-y-1">
            <div className="flex h-3 w-24 rounded" style={{
              background: 'linear-gradient(to right, #10b981, #eab308, #f97316, #ef4444)'
            }}></div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}