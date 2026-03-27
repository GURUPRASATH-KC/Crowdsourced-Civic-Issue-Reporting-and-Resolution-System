import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../utils/api';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
    case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const mapCenter = [37.7749, -122.4194]; // San Francisco as default center

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get('/issues');
        setIssues(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  if (loading) return <div className="text-center py-10">Loading map and issues...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Map Section */}
      <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-md border border-gray-200 relative z-0">
        <MapContainer center={issues.length > 0 ? [issues[0].location.lat, issues[0].location.lng] : mapCenter} zoom={12} scrollWheelZoom={true} className="h-full w-full min-h-[400px]">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {issues.map(issue => (
            <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
              <Popup className="rounded-lg max-w-sm">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-lg text-gray-800 break-words">{issue.title}</h3>
                  <p className="text-sm text-gray-600 my-2 line-clamp-3">{issue.description}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <Link to={`/issue/${issue._id}`} className="text-blue-600 text-sm font-semibold hover:underline">View details</Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Feed Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-y-auto p-4 flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
          <h2 className="text-xl font-bold text-gray-800">Recent Issues</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{issues.length} total</span>
        </div>
        <div className="space-y-4 flex-grow">
          {issues.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No issues reported yet.</p>
          ) : (
            issues.map(issue => (
              <Link to={`/issue/${issue._id}`} key={issue._id} className="block p-4 border rounded-xl hover:border-blue-400 hover:shadow-md transition-all group bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1 pr-2">{issue.title}</h3>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded min-w-max">Score: {issue.priorityScore}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{issue.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className={`px-2 py-1 rounded-full border font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                  <span className="text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded capitalize">{issue.category}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
