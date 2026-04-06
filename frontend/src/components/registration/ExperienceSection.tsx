import React from 'react';
import { ApplicationFormData, Experience } from '@/types/application';
import { FaBriefcase, FaPlus, FaTrash } from 'react-icons/fa';

interface Props {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
}

const ExperienceSection: React.FC<Props> = ({ formData, setFormData }) => {
  const addExperience = () => {
    const newExp: Experience = {
      company_name: '',
      company_address: '', // Added initial empty string for address
      position: '',
      employment_status: 'full-time',
      date_from: '',
      date_to: null,
      is_current: false
    };
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExpField = (index: number, field: keyof Experience, value: any) => {
    const newExp = [...formData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setFormData((prev: ApplicationFormData) => ({ ...prev, experience: newExp }));
  };

  return (
    <div className="space-y-6">
      {formData.experience.map((exp: Experience, index: number) => (
        <div key={index} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm relative">
          <button 
            type="button"
            onClick={() => removeExperience(index)}
            className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2"
          >
            <FaTrash />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.company_name}
                onChange={(e) => updateExpField(index, 'company_name', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2A5D]"
                placeholder="e.g. Africom Technologies"
                required
              />
            </div>
            
            {/* ADDED COMPANY ADDRESS FIELD */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Company Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.company_address}
                onChange={(e) => updateExpField(index, 'company_address', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2A5D]"
                placeholder="e.g. Addis Ababa, Ethiopia"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Employment Status</label>
              <select
                value={exp.employment_status}
                onChange={(e) => updateExpField(index, 'employment_status', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg outline-none"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExpField(index, 'position', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2A5D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Date From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={exp.date_from}
                onChange={(e) => updateExpField(index, 'date_from', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2A5D]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date To</label>
              <input
                type="date"
                disabled={exp.is_current}
                value={exp.date_to || ''}
                onChange={(e) => updateExpField(index, 'date_to', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2A5D] disabled:opacity-30"
              />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id={`current-${index}`}
              checked={exp.is_current}
              onChange={(e) => {
                const isChecked = e.target.checked;
                const newExp = [...formData.experience];
                newExp[index] = { 
                  ...newExp[index], 
                  is_current: isChecked,
                  date_to: isChecked ? null : newExp[index].date_to
                };
                setFormData((prev: ApplicationFormData) => ({ ...prev, experience: newExp }));
              }}
              className="mr-2"
            />
            <label htmlFor={`current-${index}`} className="text-sm text-gray-600 font-medium">I currently work here</label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-[#0F2A5D] hover:border-[#0F2A5D] transition-all flex items-center justify-center gap-2 font-bold"
      >
        <FaPlus className="text-sm" /> 
        <FaBriefcase /> 
        <span>Add Work Experience</span>
      </button>
    </div>
  );
};

export default ExperienceSection;