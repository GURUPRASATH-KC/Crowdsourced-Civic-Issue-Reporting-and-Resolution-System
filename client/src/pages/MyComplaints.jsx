import { useState, useEffect } from 'react';
import api from '../services/api';
import IssueCard from '../components/IssueCard';
import { Filter, ClipboardList, RefreshCw } from 'lucide-react';

const MyComplaints = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/issues/my');
      setIssues(res.data);
    } catch (err) {
      console.error('Failed to fetch your reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const filteredIssues = filter === 'All' 
    ? issues 
    : issues.filter(issue => issue.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 p-3 rounded-2xl">
            <ClipboardList className="text-primary-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Reports</h1>
            <p className="text-slate-500 mt-1">Track the progress of your submitted issues</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="text-slate-400" size={18} />
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === status 
                    ? 'bg-white shadow-sm text-primary-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your reports...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl shadow-soft border border-slate-100 border-dashed">
          <ClipboardList className="mx-auto text-slate-300 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-800">No reports found</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            {filter === 'All' 
              ? "You haven't reported any issues yet. Click 'Report Issue' to help us improve."
              : `You have no issues with status '${filter}'.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}

      {!loading && issues.length > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={fetchMyIssues}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl shadow-soft border border-slate-100 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw size={18} />
            <span>Refresh Reports</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
