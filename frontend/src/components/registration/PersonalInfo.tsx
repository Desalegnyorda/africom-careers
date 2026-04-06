import React from 'react';
import { ApplicationFormData } from '@/types/application';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaCity, FaVenusMars } from 'react-icons/fa';

interface Props {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
}

// Helper component for styled inputs - moved outside to prevent re-creation on each render
const InputGroup = ({ 
  label, 
  name, 
  icon: Icon, 
  placeholder, 
  type = "text", 
  value, 
  onChange,
  required = false
}: {
  label: string;
  name: string;
  icon: React.ComponentType<any>;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon size={16} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0F2A5D] focus:border-transparent outline-none transition-all"
        required={required}
      />
    </div>
  </div>
);

const PersonalInfo: React.FC<Props> = ({ formData, setFormData }) => {
  // Handle both input changes and select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Only allow numbers for phone field
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9+\s-]/g, '');
      setFormData((prev: ApplicationFormData) => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData((prev: ApplicationFormData) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 italic mb-4">
        Please provide your contact details as they appear on your official documents.
      </p>

      {/* Name Row */}
      <div className="space-y-6">
        <InputGroup 
          label="First Name" 
          name="first_name" 
          icon={FaUser} 
          placeholder="John" 
          value={formData.first_name || ''}
          onChange={handleChange}
          required
        />
        <InputGroup 
          label="Last Name" 
          name="last_name" 
          icon={FaUser} 
          placeholder="Doe" 
          value={formData.last_name || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Gender & Contact Row */}
      <div className="space-y-6">
        {/* 🔥 NEW: Gender Selection Field (Consistent with Backend) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaVenusMars size={16} />
            </div>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0F2A5D] focus:border-transparent outline-none transition-all appearance-none"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <InputGroup 
          label="Phone Number" 
          name="phone" 
          icon={FaPhone} 
          placeholder="+251 911 ..." 
          value={formData.phone || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email Address */}
      <InputGroup 
        label="Email Address" 
        name="email" 
        type="email" 
        icon={FaEnvelope} 
        placeholder="john.doe@example.com" 
        value={formData.email || ''}
        onChange={handleChange}
        required
      />

      {/* Address Field */}
      <InputGroup 
        label="Address" 
        name="address" 
        icon={FaMapMarkerAlt} 
        placeholder="House No, Street, Sub-city" 
        value={formData.address || ''}
        onChange={handleChange}
        required
      />

      {/* Location Row */}
      <div className="space-y-6">
        <InputGroup 
          label="City" 
          name="city" 
          icon={FaCity} 
          placeholder="Addis Ababa" 
          value={formData.city || ''}
          onChange={handleChange}
          required
        />
        <InputGroup 
          label="Country" 
          name="country" 
          icon={FaGlobe} 
          placeholder="Ethiopia" 
          value={formData.country || ''}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfo;