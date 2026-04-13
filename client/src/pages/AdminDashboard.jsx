import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  ExternalLink, 
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [issuesRes, statsRes] = await Promise.all([
        api.get('/api/issues'),
        api.get('/api/analytics')
      ]);
      setIssues(issuesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Admin data fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/api/issues/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchData(); // Refresh both stats and list
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const statCards = [
    { title: 'Total Issues', value: stats.total, icon: AlertCircle, color: 'text-primary-600', bg: 'bg-primary-50' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'In Progress', value: stats.inProgress, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin <span className="text-primary-600">Portal</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Manage community reports and oversee infrastructure status</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-soft border border-slate-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live System Overview</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="text-primary-500" size={24} />
            Recent Reports
          </h2>
          <button className="text-xs font-bold text-primary-600 hover:underline">View All Records</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Title & Reporter</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-slate-400">Syncing with database...</td></tr>
              ) : issues.length === 0 ? (
                <tr><td colSpan="4" className="py-20 text-center text-slate-400">No reports found in the system.</td></tr>
              ) : issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                        <img src={issue.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{issue.title}</p>
                        <p className="text-xs text-slate-400">{issue.createdBy?.name || 'Anonymous'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold py-1 px-3 rounded-lg bg-slate-100 text-slate-600 uppercase tracking-tight">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      issue.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                      issue.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {issue.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        disabled={updating === issue._id}
                        value={issue.status}
                        onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                        className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                      >
                        <option value="Pending">Set Pending</option>
                        <option value="In Progress">Set In Progress</option>
                        <option value="Resolved">Set Resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
