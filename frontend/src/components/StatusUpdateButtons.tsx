import React, { useState } from 'react';

interface StatusUpdateButtonsProps {
  applicantId: string;
  currentStatus: string;
  onStatusUpdate: (applicantId: string, newStatus: string) => void;
  className?: string;
}

const StatusUpdateButtons: React.FC<StatusUpdateButtonsProps> = ({
  applicantId,
  currentStatus,
  onStatusUpdate,
  className = ''
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'submitted', label: 'Submitted', color: 'bg-gray-100 text-gray-700' },
    { value: 'under_review', label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-green-100 text-green-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' }
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/applicants/${applicantId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      
      if (result.success) {
        onStatusUpdate(applicantId, newStatus);
        alert(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
      } else {
        alert(`Failed to update status: ${result.message}`);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentStatusLabel = () => {
    const status = statusOptions.find(s => s.value === currentStatus);
    return status ? status.label : currentStatus;
  };

  const getCurrentStatusColor = () => {
    const status = statusOptions.find(s => s.value === currentStatus);
    return status ? status.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Current Status:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCurrentStatusColor()}`}>
          {getCurrentStatusLabel()}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            disabled={isUpdating || status.value === currentStatus}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors
              ${status.value === currentStatus 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : `${status.color} hover:opacity-80 cursor-pointer`
              }
              ${isUpdating ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {status.label}
          </button>
        ))}
      </div>
      
      {isUpdating && (
        <div className="text-xs text-blue-600">Updating status...</div>
      )}
    </div>
  );
};

export default StatusUpdateButtons;
