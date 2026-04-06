import React, { useEffect, useState } from 'react';
import { ApplicationFormData } from '@/types/application';

interface QuestionSchema {
  id: string;      
  question: string; // Correctly matches your DB column: 'question'
}

interface Props {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
}

const GeneralQuestions: React.FC<Props> = ({ formData, setFormData }) => {
  const [dbQuestions, setDbQuestions] = useState<QuestionSchema[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the questions inserted into the 'general_questions' table
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/general-questions`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setDbQuestions(data);
      } catch (err) {
        console.error("Error loading questions from database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (qId: string, text: string) => {
    setFormData(prev => {
      // Find all answers except the one for the current question
      const otherAnswers = prev.general_answers.filter(a => a.question_id !== qId);
      
      // Update the state with the new answer included
      return {
        ...prev,
        general_answers: [
          ...otherAnswers, 
          { question_id: qId, answer_text: text }
        ]
      };
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <div className="w-8 h-8 border-4 border-[#0F2A5D] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 italic">Loading Africom Application Questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dbQuestions.map((q) => (
        <div 
          key={q.id} 
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#0F2A5D] transition-all duration-300"
        >
          <label className="block text-sm font-bold text-[#0F2A5D] mb-4">
            {q.question} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F2A5D] focus:bg-white outline-none transition-all text-gray-700"
            placeholder="Please enter your detailed response here..."
            // Logic to retrieve the current answer from the main formData
            value={formData.general_answers.find(ans => ans.question_id === q.id)?.answer_text || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />
        </div>
      ))}
      
      {dbQuestions.length === 0 && !loading && (
        <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No additional questions are required for this application at this time.</p>
        </div>
      )}
    </div>
  );
};

export default GeneralQuestions;