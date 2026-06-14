import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/**
 * Reusable ActionButton component for admin interfaces
 * Supports loading, disabled, and tooltip states
 */
export const ActionButton = ({
  onClick,
  variant = 'info', // info, success, warning, danger, default
  size = 'sm', // sm, md, lg
  icon: Icon,
  label,
  loading = false,
  disabled = false,
  tooltip,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const variants = {
    info: 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30',
    success: 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30',
    warning: 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30',
    danger: 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30',
    default: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900/30'
  };

  const sizes = {
    sm: 'p-2 h-8 w-8',
    md: 'p-2.5 h-10 w-10',
    lg: 'p-3 h-12 w-12'
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={onClick}
        disabled={disabled || loading}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={!disabled && !loading ? { scale: 1.1 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
        className={`
          relative flex items-center justify-center rounded-lg transition-all duration-200
          ${variants[variant]}
          ${sizes[size]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute"
          >
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          </motion.div>
        ) : (
          <Icon className={`h-5 w-5`} />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && label && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-50"
          >
            {label}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Action button group for table rows
 * Combines multiple action buttons with consistent spacing
 */
export const ActionButtonGroup = ({ 
  actions = [], // Array of { icon, label, onClick, variant, loading }
  className = ''
}) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {actions.map((action, idx) => (
        <ActionButton
          key={idx}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
          variant={action.variant || 'info'}
          loading={action.loading}
          disabled={action.disabled}
        />
      ))}
    </div>
  );
};

/**
 * Improved confirmation dialog component
 */
export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  destructive = false,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                destructive 
                  ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
              }`}>
                <div className="flex items-start gap-3">
                  {destructive && (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    destructive 
                      ? 'text-red-900 dark:text-red-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 flex items-center gap-2 ${
                    destructive
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {loading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    </motion.div>
                  )}
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Action button styles for full-width buttons
 */
export const ActionButton_Full = ({
  onClick,
  icon: Icon,
  label,
  variant = 'primary', // primary, success, danger, warning, secondary
  loading = false,
  disabled = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        ${variants[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      <span>{label}</span>
    </motion.button>
  );
};

export default ActionButton;
