import React from 'react';
import { ApplicationFormData, Education } from '@/types/application';
import { FaGraduationCap, FaTrash, FaPlus } from 'react-icons/fa';

interface Props {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
}

const EducationSection: React.FC<Props> = ({ formData, setFormData }) => {
  const addEducation = () => {
    // Fixed: Using education_level and graduation_year to match your types
    const newEdu: Education = { 
      institution: '', 
      education_level: '', 
      field_of_study: '', 
      graduation_year: new Date().getFullYear() 
    };
    
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEduField = (index: number, field: keyof Education, value: string | number) => {
    const newEduList = [...formData.education];
    newEduList[index] = { ...newEduList[index], [field]: value } as Education;
    setFormData((prev: ApplicationFormData) => ({ ...prev, education: newEduList }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev: ApplicationFormData) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {formData.education.map((edu: Education, index: number) => (
        <div key={index} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl relative">
          <button 
            type="button" 
            onClick={() => removeEducation(index)}
            className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2"
          >
            <FaTrash />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <FaGraduationCap /> Institution <span className="text-red-500">*</span>
              </label>
              <input 
                value={edu.institution} 
                onChange={(e) => updateEduField(index, 'institution', e.target.value)}
                placeholder="e.g. Addis Ababa University"
                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-[#0F2A5D]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Education Level <span className="text-red-500">*</span>
              </label>
              <input 
                value={edu.education_level} 
                onChange={(e) => updateEduField(index, 'education_level', e.target.value)}
                placeholder="e.g. BSc, MSc, Diploma"
                className="w-full p-3 mt-1 border rounded-lg outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input 
                value={edu.field_of_study} 
                onChange={(e) => updateEduField(index, 'field_of_study', e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full p-3 mt-1 border rounded-lg outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Graduation Year <span className="text-red-500">*</span>
              </label>
              <input 
                type="number"
                value={edu.graduation_year} 
                onChange={(e) => updateEduField(index, 'graduation_year', parseInt(e.target.value) || 0)}
                className="w-full p-3 mt-1 border rounded-lg outline-none"
                required
              />
            </div>
          </div>
        </div>
      ))}
      
      <button 
        type="button" 
        onClick={addEducation} 
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#0F2A5D] hover:text-[#0F2A5D] flex items-center justify-center gap-2 transition-all"
      >
        <FaPlus /> Add Education
      </button>
    </div>
  );
};

export default EducationSection;