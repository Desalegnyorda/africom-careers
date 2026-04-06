import React from 'react';
import { ApplicationFormData } from '@/types/application';

// Mock position data with valid UUIDs - replace with actual API call
// Mock position data from database
const POSITIONS = [
  { 
    id: '93cf13e3-ebff-11f0-b26e-e8d8d170ea35', 
    name: 'Backend Developer' 
  },
  { 
    id: '93cf649c-ebff-11f0-b26e-e8d8d170ea35', 
    name: 'Data Analyst' 
  },
  { 
    id: '93cf5f7c-ebff-11f0-b26e-e8d8d170ea35', 
    name: 'DevOps Engineer' 
  },
  { 
    id: '93cf5977-ebff-11f0-b26e-e8d8d170ea35', 
    name: 'Frontend Developer' 
  },
  { 
    id: '93ca8bd4-ebff-11f0-b26e-e8d8d170ea35', 
    name: 'Software Engineer' 
  }
];
interface Props {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
}

const ProfessionalPath: React.FC<Props> = ({ formData, setFormData }) => {
  const updatePosition = (index: number, value: string) => {
    setFormData((prev: ApplicationFormData) => {
      const newPos = [...prev.positions];
      // Ensure we maintain the priority when updating
      const priority = (index + 1) as 1 | 2 | 3; // Explicitly type as 1, 2, or 3
      newPos[index] = { 
        position_id: value,
        priority: priority
      };
      return { ...prev, positions: newPos };
    });
  };

  // Filter out already selected positions from dropdowns
  const getAvailablePositions = (currentIndex: number) => {
    const selectedPositions = formData.positions
      .map((p, idx) => idx !== currentIndex ? p.position_id : null)
      .filter(Boolean);
    
    return POSITIONS.filter(pos => !selectedPositions.includes(pos.id));
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Why this matters:</strong> Your position preferences help us understand which roles you're most interested in. 
          This allows us to contact you about suitable openings now or in the future, and prioritize candidates 
          based on their stated preferences and our organizational needs. Please select up to 3 positions in order of preference.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((idx: number) => {
          const availablePositions = getAvailablePositions(idx);
          const currentValue = formData.positions[idx]?.position_id || '';
          
          return (
            <div key={idx} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Priority {idx + 1} {idx === 0 && <span className="text-red-500">*</span>}
              </label>
              <select
                required={idx === 0}
                value={currentValue}
                onChange={(e) => updatePosition(idx, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0F2A5D] focus:border-[#0F2A5D]"
              >
                <option value="">{idx === 0 ? 'Select a position' : 'Optional'}</option>
                {availablePositions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
              {idx === 0 && !currentValue && (
                <p className="mt-1 text-sm text-black-600"></p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalPath;