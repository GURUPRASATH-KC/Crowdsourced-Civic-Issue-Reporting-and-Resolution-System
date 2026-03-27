import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { AlertTriangle, ThumbsUp, Map, Calendar, User, Tag } from 'lucide-react';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch issue');
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleConfirm = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setConfirming(true);
    try {
      const res = await api.post(`/issues/confirm/${id}`);
      setIssue(res.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm issue');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-xl font-medium text-gray-600">Loading issue details...</div>;
  if (error || !issue) return <div className="text-center py-10 text-red-500 font-medium bg-red-50 rounded-lg">{error || 'Issue not found'}</div>;

  const hasConfirmed = user && issue.confirmedByUsers?.includes(user.id || user._id);
  const imageUrl = issue.imageURL && issue.imageURL !== 'no-photo.jpg' 
    ? `http://localhost:5000${issue.imageURL}` 
    : null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {imageUrl && (
        <div className="w-full h-64 sm:h-80 bg-gray-100 border-b">
          <img src={imageUrl} alt={issue.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-8">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{issue.title}</h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold capitalize border">
              {issue.status}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
              Score: {issue.priorityScore}
            </span>
          </div>
        </div>

        <p className="text-gray-700 text-lg mb-8 leading-relaxed bg-gray-50 p-4 rounded-lg border">{issue.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Category: <span className="text-gray-900 capitalize">{issue.category}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Location: <span className="text-gray-900">{issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Reported: <span className="text-gray-900">{new Date(issue.createdAt).toLocaleDateString()}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="font-medium">By: <span className="text-gray-900">{issue.createdBy?.name || 'Unknown'}</span></span>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <ThumbsUp className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">{issue.confirmationsCount} {issue.confirmationsCount === 1 ? 'person has' : 'people have'} confirmed this</span>
          </div>
          
          <button 
            onClick={handleConfirm} 
            disabled={confirming || hasConfirmed || issue.status === 'Resolved'}
            className={`px-8 py-2.5 rounded-lg font-bold shadow-sm transition-all focus:ring-4 focus:ring-blue-100 ${
              hasConfirmed 
                ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200' 
                : issue.status === 'Resolved'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed border'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 shadow-lg cursor-pointer'
            }`}
          >
            {confirming ? 'Confirming...' : hasConfirmed ? '✓ You Confirmed' : issue.status === 'Resolved' ? 'Issue Resolved' : 'Confirm Issue Exists'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
