import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import api from '../utils/api';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Location Picker Component
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const mapCenter = [37.7749, -122.4194]; // San Francisco as default center

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'road',
  });
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      setError('Please select a location on the map');
      return;
    }

    setLoading(true);
    setError('');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    submitData.append('lat', position.lat);
    submitData.append('lng', position.lng);
    if (image) {
      submitData.append('image', image);
    }

    try {
      await api.post('/issues/create', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 p-8 text-white text-center">
        <h2 className="text-3xl font-bold">Report a Civic Issue</h2>
        <p className="opacity-90 mt-2 font-medium">Help improve our community by reporting issues you see.</p>
      </div>
      
      <div className="p-8">
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 font-medium text-sm border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Issue Title</label>
                <input 
                  type="text" name="title" className="input-field" 
                  value={formData.title} onChange={handleChange} required 
                  placeholder="e.g., Deep Pothole on Main St"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Category</label>
                <select 
                  name="category" className="input-field" 
                  value={formData.category} onChange={handleChange} required
                >
                  <option value="road">Road & Transport</option>
                  <option value="water">Water & Pipeline</option>
                  <option value="electricity">Electricity & Lighting</option>
                  <option value="waste">Waste Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea 
                  name="description" className="input-field h-32 resize-none" 
                  value={formData.description} onChange={handleChange} required 
                  placeholder="Provide details about the issue..."
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Upload Photo (Optional)</label>
                <input 
                  type="file" accept="image/*" onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="block text-gray-700 font-semibold mb-1">
                Location <span className="text-red-500">*</span> 
                <span className="text-sm font-normal text-gray-500 ml-2">(Click map to drop pin)</span>
              </label>
              <div className="flex-grow rounded-xl overflow-hidden border border-gray-300 relative z-0 min-h-[300px]">
                <MapContainer center={mapCenter} zoom={13} className="h-full w-full cursor-crosshair">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              {position && (
                <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-50 p-2 rounded inline-block">
                  Latitude: {position.lat.toFixed(6)} | Longitude: {position.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t mt-8">
            <button type="submit" disabled={loading} className="w-full md:w-auto px-10 btn-primary text-lg ml-auto block shadow-lg shadow-blue-500/30">
              {loading ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
