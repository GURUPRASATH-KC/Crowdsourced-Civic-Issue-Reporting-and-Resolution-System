import { MapPin, Calendar, User, ArrowUpCircle, ImageOff } from 'lucide-react';
import api from '../services/api';
import { useState } from 'react';
import { motion } from 'framer-motion';

const IssueCard = ({ issue }) => {
  const [upvotes, setUpvotes] = useState(issue.upvotes || 0);
  const [imageError, setImageError] = useState(false);

  const handleUpvote = async () => {
    try {
      const res = await api.post(`/api/issues/${issue._id}/upvote`);
      setUpvotes(res.data.upvotes);
    } catch (err) {
      console.error('Upvote failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="card group"
    >
      <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-slate-100 flex items-center justify-center">
        {!imageError && issue.image ? (
          <img 
            src={issue.image} 
            alt={issue.title} 
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <ImageOff size={32} />
            <span className="text-xs mt-2 font-medium">Image unavailable</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 status-badge ${getStatusColor(issue.status)} shadow-sm`}>
          {issue.status}
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 uppercase tracking-wider">
          {issue.category}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{issue.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 min-h-[2.5rem]">
          {issue.description}
        </p>

        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={14} className="text-primary-500" />
            <span className="truncate">{issue.location.address || `Lat: ${issue.location.lat.toFixed(4)}, Lng: ${issue.location.lng.toFixed(4)}`}</span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <User size={14} />
              <span>{issue.createdBy?.name || 'Anonymous'}</span>
            </div>
            <button 
              onClick={handleUpvote}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
            >
              <ArrowUpCircle size={16} />
              <span className="text-sm font-bold">{upvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;
