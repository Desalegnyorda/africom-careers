import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// Aligned with Backend Joi Schema & MySQL DESCRIBE
interface GeneralAnswer {
  question_id: string;
  answer_text: string;
}

interface QuestionSchema {
  id: string;      // From MySQL general_questions.id
  question: string; // From MySQL general_questions.question
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | '';
  address: string;
  country: string;
  city: string;
  vacancy_id: string;
  cv_file_path: File | null;
  general_answers: GeneralAnswer[];
  skills_description: string;
}

const JobApplicationForm: React.FC = () => {
  const [dbQuestions, setDbQuestions] = useState<QuestionSchema[]>([]);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    vacancy_id: 'e73a421f-f274-11f0-b26e-e8d8d170ea35', // Use your real ID
    cv_file_path: null,
    general_answers: [],
    skills_description: '',
  });

  // 1. Fetch General Questions on Load
  useEffect(() => {
    fetch('http://localhost:5000/api/questions') // Your backend endpoint
      .then((res) => res.json())
      .then((data) => setDbQuestions(data))
      .catch((err) => console.error('Error fetching questions:', err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: fileInput.files ? fileInput.files[0] : null
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 2. Handle Answer Updates for General Questions
  const handleAnswerChange = (qId: string, text: string) => {
    setFormData(prev => {
      const otherAnswers = prev.general_answers.filter(a => a.question_id !== qId);
      return {
        ...prev,
        general_answers: [...otherAnswers, { question_id: qId, answer_text: text }]
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('gender', formData.gender);
    data.append('address', formData.address);
    data.append('country', formData.country);
    data.append('city', formData.city);
    data.append('vacancy_id', formData.vacancy_id);

    if (formData.cv_file_path) {
      data.append('cv_file_path', formData.cv_file_path);
    }

    // JSON Arrays for Backend Parsing
    data.append('positions', JSON.stringify([
      { position_id: '93cf13e3-ebff-11f0-b26e-e8d8d170ea35', priority: "1" }
    ]));
    data.append('education', JSON.stringify([])); 
    data.append('experience', JSON.stringify([]));
    data.append('general_answers', JSON.stringify(formData.general_answers)); // Aligned with DB
    data.append('skills_description', formData.skills_description);

    try {
      const response = await fetch('http://localhost:5000/api/applicants/apply', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Application submitted successfully! Applicant ID: ' + result.applicant_id);
      } else {
        alert('Error: ' + (result.message || JSON.stringify(result.error)));
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to connect to server.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 my-10">
      <h2 className="text-3xl font-bold text-[#0F2A5D] mb-8 border-b pb-4">Job Application Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Personal Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>
        </div>

        {/* Dynamic General Questions Section */}
        {dbQuestions.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">General Questions</h3>
            <div className="space-y-6">
              {dbQuestions.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-gray-800 mb-2">{q.question} *</label>
                  <textarea
                    required
                    rows={3}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:bg-white bg-white"
                    placeholder="Provide your answer..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Skills</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Describe your skills and expertise *</label>
            <textarea
              name="skills_description"
              value={formData.skills_description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white bg-white"
              placeholder="Please describe your technical skills, soft skills, certifications, and any relevant expertise..."
              required
            />
          </div>
        </div>

        {/* CV Upload */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-[#0F2A5D] border-b border-gray-200 pb-2">Resume / CV</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Resume / CV (PDF Only) *</label>
            <input
              type="file"
              name="cv_file_path"
              onChange={handleChange}
              accept=".pdf"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-[#0F2A5D] text-white rounded-md font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;