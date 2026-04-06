import React, { useState } from 'react';
import { ApplicationFormData } from '@/types/application';
import PersonalInfo from './PersonalInfo';
import ProfessionalPath from './ProfessionalPath';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ResumeUpload from './ResumeUpload';
import GeneralQuestions from './GeneralQuestions';
import { FaSpinner } from 'react-icons/fa';

const RegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    vacancy_id: 'e73a421f-f274-11f0-b26e-e8d8d170ea35', 
    positions: [
      { position_id: '', priority: 1 }, 
      { position_id: '', priority: 2 }, 
      { position_id: '', priority: 3 }
    ],
    education: [], 
    experience: [], 
    skills: [], 
    skills_description: '', // Matches updated interface
    cv: null,
    general_answers: [] 
  });

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewing(true);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      
      // 1. Append Text fields
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('gender', formData.gender);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('country', formData.country);
      data.append('city', formData.city);
      data.append('vacancy_id', formData.vacancy_id);
      data.append('skills_description', formData.skills_description);
      
      // 2. Filter and Stringify JSON arrays
      const positionsToSubmit = formData.positions.filter(pos => pos.position_id !== '');
      data.append('positions', JSON.stringify(positionsToSubmit));
      data.append('education', JSON.stringify(formData.education));
      data.append('experience', JSON.stringify(formData.experience));
      data.append('general_answers', JSON.stringify(formData.general_answers));

      // 3. Transform Skills for backend compatibility
      const skillIdsOnly = formData.skills
        .map(s => s.skill_id)
        .filter(id => id !== ''); 
      
      data.append('skills', JSON.stringify(skillIdsOnly));

      // 4. File Upload
      if (formData.cv) {
        data.append('cv', formData.cv); 
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applicants/apply`, {
        method: 'POST',
        body: data 
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setIsSubmitted(true);
        setIsReviewing(false);
        window.scrollTo(0, 0);
      } else {
        // Handle specific duplicate email error
        if (response.status === 409 && result.error_type === 'duplicate_email') {
          alert(result.message);
        } else {
          alert(`Error: ${result.message || 'Check console for details'}`);
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="success-card md:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg text-center border-t-4 border-blue-600 md:px-12 lg:px-16 xl:px-20">
        <div className="success-icon mb-6 text-green-500">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for applying to Africom Technologies. Your response has been recorded.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="submit-another-btn text-blue-600 hover:underline font-medium"
        >
          Submit another response
        </button>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please review your application below. You can make any changes before final submission.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Personal Information</h2>
          <PersonalInfo formData={formData} setFormData={setFormData} />
        </div>
        
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Position Preference</h2>
          <ProfessionalPath formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Education History</h2>
          <EducationSection formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Work Experience</h2>
          <ExperienceSection formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Key Skills</h2>
          <SkillsSection formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">General Questions</h2>
          <GeneralQuestions formData={formData} setFormData={setFormData} />
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Resume / CV</h2>
          <ResumeUpload 
            setFile={(file) => setFormData((prev) => ({ ...prev, cv: file }))} 
            currentFile={formData.cv}
          />
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            onClick={() => setIsReviewing(false)} 
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-bold"
          >
            ← Back to Form
          </button>
          <button 
            onClick={handleFinalSubmit} 
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-bold shadow-lg flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Final Application</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleReview} className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
      <h1 className="text-3xl font-extrabold text-[#0F2A5D] border-b pb-4">Job Application</h1>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Personal Information</h2>
        <PersonalInfo formData={formData} setFormData={setFormData} />
      </div>
      
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Position Preference</h2>
        <ProfessionalPath formData={formData} setFormData={setFormData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Education History</h2>
        <EducationSection formData={formData} setFormData={setFormData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Work Experience</h2>
        <ExperienceSection formData={formData} setFormData={setFormData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Key Skills</h2>
        <SkillsSection formData={formData} setFormData={setFormData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">General Questions</h2>
        <GeneralQuestions formData={formData} setFormData={setFormData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Resume / CV</h2>
        <ResumeUpload 
          setFile={(file) => setFormData((prev) => ({ ...prev, cv: file }))} 
          currentFile={formData.cv}
        />
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-[#0F2A5D] hover:bg-[#1a3a7a] disabled:bg-gray-400 text-white font-bold rounded-full transition-all shadow-lg text-lg flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Preparing Review...</span>
            </>
          ) : (
            <span>Review Application</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;