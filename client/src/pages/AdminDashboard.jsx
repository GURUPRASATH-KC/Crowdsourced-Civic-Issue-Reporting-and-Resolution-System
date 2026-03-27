import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Settings, Trash2, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchIssues = async () => {
    try {
      const res = await api.get('/admin/issues');
      setIssues(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/assign/${id}`, { status: newStatus });
      fetchIssues();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAssignDepartment = async (id, newDepartment) => {
    try {
      await api.put(`/admin/assign/${id}`, { department: newDepartment });
      fetchIssues();
    } catch (err) {
      alert('Failed to assign department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await api.delete(`/admin/delete/${id}`);
        fetchIssues();
      } catch (err) {
        alert('Failed to delete issue');
      }
    }
  };

  const filteredIssues = filter === 'All' ? issues : issues.filter(i => i.status === filter);

  if (loading) return <div className="text-center py-10 font-medium text-gray-600">Loading admin dashboard...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-slate-800 p-6 text-white flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-6 h-6" /> Admin Dashboard</h1>
          <p className="text-slate-300 mt-1 text-sm font-medium">Manage entries, update statuses, and clean up resolutions.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-300 whitespace-nowrap">Filter by Status:</label>
          <select 
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Issues</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b relative z-0">
            <tr>
              <th className="px-6 py-4">Issue Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Score</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map(issue => (
              <tr key={issue._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 line-clamp-1">{issue.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(issue.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 capitalize font-medium">{issue.category}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded border border-blue-200">{issue.priorityScore}</span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 transition-shadow shadow-sm"
                    value={issue.department || 'Unassigned'}
                    onChange={(e) => handleAssignDepartment(issue._id, e.target.value)}
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Transport">Transport</option>
                    <option value="Water Dept">Water Dept</option>
                    <option value="Electricity Board">Electricity Board</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select 
                    className={`border text-sm rounded font-medium focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 shadow-sm transition-shadow ${
                      issue.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                      issue.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(issue._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Delete Issue"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                  <CheckCircle className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  No issues found matching the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
