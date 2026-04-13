import { useState, useEffect } from 'react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import IssueCard from '../components/IssueCard';
import { LayoutGrid, Map as MapIcon, RefreshCw, AlertCircle } from 'lucide-react';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/issues');
      setIssues(res.data);
    } catch (err) {
      console.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Civic Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoring and reporting community issues together</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={18} />
            <span>Grid View</span>
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MapIcon size={18} />
            <span>Map View</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Fetching community reports...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl shadow-soft border border-slate-50 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
            <AlertCircle className="text-slate-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No reports found</h2>
          <p className="text-slate-500 mt-2">Check back later or report a new issue yourself.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map(issue => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="h-[650px] rounded-3xl overflow-hidden shadow-soft border border-slate-100 z-0">
          <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {issues.map(issue => (
              <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
                <Popup className="rounded-2xl overflow-hidden">
                  <div className="w-48 p-1 flex flex-col gap-2">
                    <img src={issue.image} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <h4 className="font-bold text-slate-800 m-0">{issue.title}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-primary-100 text-primary-700 rounded-md self-start uppercase tracking-wider">{issue.category}</span>
                    <p className="text-[10px] text-slate-500 m-0 line-clamp-1">{issue.location.address}</p>
                    <div className="h-px bg-slate-100 my-1" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status: {issue.status}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {!loading && issues.length > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={fetchIssues}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl shadow-soft border border-slate-100 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw size={18} />
            <span>Sync Results</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
