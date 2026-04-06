const Joi = require('joi');

exports.applySchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(2)
    .required(),

  last_name: Joi.string()
    .trim()
    .min(2)
    .required(),

  gender: Joi.string()
    .valid('Male', 'Female')
    .required()
    .messages({
      'any.only': 'Gender must be either Male or Female'
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  phone: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Phone number is required'
    }),

  address: Joi.string()
    .trim()
    .allow(null, ''),

  country: Joi.string()
    .trim()
    .allow(null, ''),

  city: Joi.string()
    .trim()
    .allow(null, ''),

  // 🛠️ FIXED: Removed version constraint to support MySQL UUID v1 format
  vacancy_id: Joi.string()
    .guid() 
    .required()
    .messages({
      'string.guid': 'Vacancy ID must be a valid UUID',
      'any.required': 'Vacancy ID is required'
    }),

  cv_file_path: Joi.string()
    .allow(null)
    .optional(),

  // 🔥 Skills Description (from the Africom application textarea)
  skills_description: Joi.string()
    .allow(null, '')
    .optional(),

  // 🔥 General Answers (for the questions fetched from DB)
  general_answers: Joi.array()
    .items(
      Joi.object({
        question_id: Joi.string().guid().required(),
        answer_text: Joi.string().required()
      })
    )
    .optional()
    .default([]),

  positions: Joi.array()
    .items(
      Joi.object({
        position_id: Joi.string()
          .guid()
          .required(),
        priority: Joi.alternatives().try(
          Joi.string().valid('1', '2', '3'),
          Joi.number().valid(1, 2, 3)
        ).required()
      })
    )
    .min(1)
    .max(3)
    .required(),

  education: Joi.array()
    .items(
      Joi.object({
        institution: Joi.string().required(),
        education_level: Joi.string().required(),
        field_of_study: Joi.string().required(),
        graduation_year: Joi.number().integer().min(1900).max(2100).required()
      })
    )
    .optional()
    .default([]),

  experience: Joi.array()
    .items(
      Joi.object({
        company_name: Joi.string().required(),
        // 🔥 Added company_address to match your SQL table structure
        company_address: Joi.string().allow(null, '').optional(),
        position: Joi.string().required(),
        employment_status: Joi.string()
          .valid('full-time', 'part-time', 'contract')
          .required(),
        date_from: Joi.date().required(),
        date_to: Joi.date().allow(null, ''),
        is_current: Joi.boolean().optional().default(false)
      })
    )
    .optional()
    .default([]),

  skills: Joi.array()
    .items(
      Joi.string().guid().message('Each skill must be a valid UUID')
    )
    .optional()
    .default([])
})
.options({
  abortEarly: true,
  stripUnknown: true 
});