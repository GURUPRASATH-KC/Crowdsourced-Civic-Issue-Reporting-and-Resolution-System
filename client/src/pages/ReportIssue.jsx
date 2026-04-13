import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, Send, Loader2, Info } from 'lucide-react';

const MapEvents = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    location: { lat: 12.9716, lng: 77.5946, address: '' },
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-locate user on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        }
      );
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setImagePreview(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeolocation = () => {
    setGeolocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: { ...prev.location, lat: latitude, lng: longitude }
          }));
          setGeolocating(false);
          toast.success('Location updated');
        },
        () => {
          toast.error('Could not get your location');
          setGeolocating(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported');
      setGeolocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error('Please upload an image');
    setSubmitting(true);

    try {
      await api.post('/api/issues', {
        ...formData,
        image: imagePreview
      });

      toast.success('Report submitted successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Report an <span className="text-primary-600">Issue</span></h1>
        <p className="text-slate-500 mt-2 text-lg">Help improving our city by documenting civic problems in your area.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Info className="text-primary-500" size={20} />
              Issue Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Summarize the problem (e.g. Broken streetlight near park)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Pothole</option>
                    <option>Garbage</option>
                    <option>Streetlight</option>
                    <option>Water Issue</option>
                    <option>Sanitation</option>
                    <option>Roads</option>
                    <option>Electricity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Area or Street name"
                    value={formData.location.address}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  placeholder="Provide more details about the problem and how long it's been there..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="text-primary-500" size={20} />
                Pin Location
              </h2>
              <button 
                type="button"
                onClick={handleGeolocation}
                disabled={geolocating}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-lg hover:bg-primary-200 transition-colors"
              >
                {geolocating ? <Loader2 className="animate-spin" size={14} /> : <MapPin size={14} />}
                {geolocating ? 'Locating...' : 'Use My Current Location'}
              </button>
            </div>
            
            <div className="h-[300px] rounded-xl overflow-hidden shadow-inner border border-slate-100 relative">
              <MapContainer 
                center={[formData.location.lat, formData.location.lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                // This key forces a re-render when the center changes (useful for auto-locate)
                key={`${formData.location.lat}-${formData.location.lng}`}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker 
                  position={[formData.location.lat, formData.location.lng]} 
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, lat: position.lat, lng: position.lng } 
                      }));
                    },
                  }}
                />
                <MapEvents setLocation={(loc) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, lat: loc.lat, lng: loc.lng } 
                }))} />
              </MapContainer>
              <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg text-[10px] font-bold text-slate-700 shadow-soft border border-slate-100 flex items-center justify-between">
                <span>Pin the exact issue location.</span>
                <span className="text-primary-600">Drag or Click map</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Camera className="text-primary-500" size={20} />
              Photo Evidence
            </h2>
            
            <div className="space-y-4">
              <div 
                onClick={() => document.getElementById('image-input').click()}
                className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                  imagePreview ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                }`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="text-slate-400 mb-2" size={40} />
                    <p className="text-slate-500 text-sm font-medium">Click to upload photo</p>
                    <p className="text-slate-400 text-[10px] mt-1">JPG, PNG, GIF up to 5MB</p>
                  </>
                )}
              </div>
              <input 
                id="image-input"
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
              
              {imagePreview && (
                <button 
                  type="button"
                  onClick={() => { setImagePreview(null); setFormData({ ...formData, image: null }); }}
                  className="w-full py-2 text-red-500 text-xs font-bold hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-primary-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:grayscale"
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            <span className="text-lg">{submitting ? 'Submitting Report...' : 'Submit Report'}</span>
          </button>
          
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            By submitting this report, you confirm that the information provided is accurate to the best of your knowledge. Fake reporting may lead to account suspension.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
