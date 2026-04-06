import React from 'react';
import { ApplicationFormData } from '@/types/application';

interface Props {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
}

const SkillsSection: React.FC<Props> = ({ formData, setFormData }) => {
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      skills_description: value 
    }));
  };

  const isEmpty = !formData.skills_description || formData.skills_description.trim() === '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-lg font-semibold text-gray-800">
          Skills <span className="text-red-500">*</span>
        </label>
        
        <textarea
          value={formData.skills_description || ''}
          onChange={handleTextChange}
          className="w-full min-h-[140px] p-4 bg-[#EBF3FF] border-none rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all text-gray-700 placeholder-gray-400"
          placeholder="Type your skills here..."
          required
        />

      

        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-2xl">
          A short list of key skills that are directly relevant to the job, such as proficiency in specific software, languages, or other technical skills.
        </p>
      </div>
    </div>
  );
};

export default SkillsSection;