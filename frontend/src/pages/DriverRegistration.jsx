import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { submitDriverApplication } from '../services/driverService';

const DriverRegistration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    yearsOfExperience: '',
    preferredAreas: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    licensePhoto: null,
    profilePhoto: null,
    medicalCertificate: null,
    trainingCertificate: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Submit application
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('yearsOfExperience', formData.yearsOfExperience);
      fd.append('preferredAreas', formData.preferredAreas);
      fd.append('bankName', formData.bankName);
      fd.append('accountNumber', formData.accountNumber);
      fd.append('accountName', formData.accountName);
      if (formData.licensePhoto) fd.append('license_photo', formData.licensePhoto);
      if (formData.profilePhoto) fd.append('profile_photo', formData.profilePhoto);
      if (formData.medicalCertificate) fd.append('medical_certificate', formData.medicalCertificate);
      if (formData.trainingCertificate) fd.append('training_certificate', formData.trainingCertificate);

      const response = await submitDriverApplication(fd);
      if (response.data.success) {
        setSuccess(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to submit application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your driver application has been successfully submitted. We will review your documents and contact you within 3-5 business days.
          </p>
          <p className="text-sm text-gray-500">Check your email for application confirmation and updates.</p>
        </div>
      </motion.div>
    );
  }

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Experience & areas' },
    { number: 2, title: 'License & Docs', description: 'Upload documents' },
    { number: 3, title: 'Bank Details', description: 'Payment info' },
    { number: 4, title: 'Review', description: 'Confirm & submit' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s.number ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
              }`}>
                {s.number}
              </div>
              <div className="ml-2">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{s.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{s.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRightIcon className="h-5 w-5 mx-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full">
          <div className={`bg-primary-600 h-1 rounded-full transition-all`} style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience & Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Driving Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Operating Areas
              </label>
              <textarea
                name="preferredAreas"
                value={formData.preferredAreas}
                onChange={handleInputChange}
                placeholder="e.g., Main Campus, Medical Campus, Residential Areas"
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: License & Documents */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField
                label="Driver's License Photo"
                name="licensePhoto"
                onChange={handleFileChange}
                required
              />
              <FileUploadField
                label="Profile Photo"
                name="profilePhoto"
                onChange={handleFileChange}
                required
              />
              <FileUploadField
                label="Medical Certificate"
                name="medicalCertificate"
                onChange={handleFileChange}
              />
              <FileUploadField
                label="Training Certificate"
                name="trainingCertificate"
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Bank Details */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bank Account Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Name
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Your Application</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formData.yearsOfExperience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bank:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formData.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Documents Uploaded:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {[formData.licensePhoto, formData.profilePhoto, formData.medicalCertificate, formData.trainingCertificate].filter(Boolean).length}/4
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By submitting this application, you agree to our terms and conditions. We will review your information and contact you within 3-5 business days.
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
          >
            {loading ? 'Submitting...' : step === 4 ? 'Submit Application' : 'Next'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const FileUploadField = ({ label, name, onChange, required = false }) => {
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && '*'}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          name={name}
          onChange={handleChange}
          required={required}
          className="hidden"
          id={name}
        />
        <label htmlFor={name} className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition">
          <div className="flex items-center gap-2 justify-center">
            <DocumentIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {fileName || 'Choose file'}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default DriverRegistration;
