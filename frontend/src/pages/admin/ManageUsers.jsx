import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PencilIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { ActionButton, ActionButtonGroup, ConfirmationDialog } from '../../components/ActionButtons';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, userId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || (user.is_active && filterStatus === 'active') || (!user.is_active && filterStatus === 'inactive');
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (userId) => {
    setDeleteConfirm({ isOpen: true, userId });
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/admin/users/${deleteConfirm.userId}`);
      if (response.data?.success) {
        setDeleteConfirm({ isOpen: false, userId: null });
        await fetchUsers();
      } else {
        alert('Failed to delete user: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to delete user'));
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = { admin: 'bg-red-100 text-red-800', driver: 'bg-blue-100 text-blue-800', user: 'bg-green-100 text-green-800' };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading users...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Users</h1>
        <p className="text-gray-600 dark:text-gray-400">Total Users: {users.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={fetchUsers} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Refresh</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{user.user_id}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{user.first_name} {user.last_name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.phone}</td>
                  <td className="px-6 py-3 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>{user.role}</span></td>
                  <td className="px-6 py-3 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.is_active)}`}>{user.is_active ? 'active' : 'inactive'}</span></td>
                  <td className="px-6 py-3 text-sm">
                    <ActionButtonGroup actions={[
                      { icon: EyeIcon, label: 'View', variant: 'info', onClick: () => navigate(`/admin/users/${user.id}`) },
                      { icon: PencilIcon, label: 'Edit', variant: 'warning', onClick: () => navigate(`/admin/users/${user.id}`) },
                      { icon: TrashIcon, label: 'Delete', variant: 'danger', onClick: () => handleDelete(user.id) }
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white">Previous</button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages || 1}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 dark:text-white">Next</button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        destructive
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, userId: null })}
      />
    </motion.div>
  );
};

export default ManageUsers;
