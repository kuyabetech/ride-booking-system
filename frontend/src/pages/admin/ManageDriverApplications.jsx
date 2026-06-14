import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, EyeIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { getDriverApplications, approveDriverApplication, rejectDriverApplication } from '../../services/driverService';
import { ActionButton_Full, ConfirmationDialog } from '../../components/ActionButtons';

const ManageDriverApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('submitted');
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState({ approve: false, reject: false });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, appId: null });

  useEffect(() => {
    fetchApplications();
  }, [activeTab, page]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getDriverApplications(activeTab, page);
      if (response.data.success) {
        setApplications(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (appId) => {
    setConfirmDialog({ isOpen: true, type: 'approve', appId });
  };

  const confirmApprove = async () => {
    try {
      setActionLoading({ ...actionLoading, approve: true });
      const response = await approveDriverApplication(confirmDialog.appId);
      if (response.data?.success) {
        setConfirmDialog({ isOpen: false, type: null, appId: null });
        await fetchApplications();
      } else {
        alert('Failed to approve application: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to approve application'));
      console.error(err);
    } finally {
      setActionLoading({ ...actionLoading, approve: false });
    }
  };

  const handleReject = (app) => {
    setSelectedApp(app);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    try {
      setActionLoading({ ...actionLoading, reject: true });
      const response = await rejectDriverApplication(selectedApp.id, rejectReason);
      if (response.data?.success) {
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedApp(null);
        await fetchApplications();
      } else {
        alert('Failed to reject application: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Failed to reject application'));
      console.error(err);
    } finally {
      setActionLoading({ ...actionLoading, reject: false });
    }
  };

  const handleCancel = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedApp(null);
  };

  const tabs = [
    { label: 'Submitted', value: 'submitted' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  if (loading && applications.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96">
        <div className="text-gray-600 dark:text-gray-400">Loading applications...</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and manage driver applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setActiveTab(tab.value); setPage(1); }}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab.value
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No applications found</p>
          </div>
        ) : (
          applications.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Applicant Info */}
                <div className="md:col-span-2">
                  <div className="flex gap-4">
                    {app.profile_picture && (
                      <img src={app.profile_picture} alt={app.first_name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {app.first_name} {app.last_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{app.email}</p>
                      <p className="text-sm text-gray-500 mt-1">{app.phone}</p>
                      <div className="mt-3 flex gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Experience</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{app.years_of_experience || 'N/A'} years</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Application #</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{app.application_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Submitted</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(app.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      app.status === 'submitted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {(app.status === 'submitted' || app.status === 'under_review') && (
                    <div className="flex gap-2 mt-4">
                      <ActionButton_Full
                        onClick={() => handleApprove(app.id)}
                        icon={CheckCircleIcon}
                        label="Approve"
                        variant="success"
                        loading={actionLoading.approve && confirmDialog.appId === app.id}
                      />
                      <ActionButton_Full
                        onClick={() => handleReject(app)}
                        icon={XCircleIcon}
                        label="Reject"
                        variant="danger"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Documents Section */}
              {(app.license_photo_url || app.profile_photo_url || app.medical_certificate_url || app.training_certificate_url) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white mb-3">Submitted Documents:</p>
                  <div className="flex gap-3 flex-wrap">
                    {app.license_photo_url && (
                      <a
                        href={app.license_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      >
                        <DocumentIcon className="h-4 w-4" />
                        <span className="text-sm">License Photo</span>
                      </a>
                    )}
                    {app.profile_photo_url && (
                      <a
                        href={app.profile_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      >
                        <DocumentIcon className="h-4 w-4" />
                        <span className="text-sm">Profile Photo</span>
                      </a>
                    )}
                    {app.medical_certificate_url && (
                      <a
                        href={app.medical_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      >
                        <DocumentIcon className="h-4 w-4" />
                        <span className="text-sm">Medical Cert</span>
                      </a>
                    )}
                    {app.training_certificate_url && (
                      <a
                        href={app.training_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      >
                        <DocumentIcon className="h-4 w-4" />
                        <span className="text-sm">Training Cert</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Application</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejection:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Invalid documents, failed background check, etc."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              rows="4"
              disabled={actionLoading.reject}
            />
            <div className="flex gap-3">
              <ActionButton_Full
                onClick={handleCancel}
                label="Cancel"
                variant="secondary"
                disabled={actionLoading.reject}
              />
              <ActionButton_Full
                onClick={confirmReject}
                label="Reject"
                variant="danger"
                loading={actionLoading.reject}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'approve'}
        title="Approve Application"
        message={`Are you sure you want to approve this driver application? They will be added to the system and assigned a vehicle.`}
        confirmText="Approve"
        cancelText="Cancel"
        loading={actionLoading.approve}
        onConfirm={confirmApprove}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null, appId: null })}
      />
    </motion.div>
  );
};

export default ManageDriverApplications;
