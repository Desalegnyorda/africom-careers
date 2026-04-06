const { applySchema } = require('./applicant.validation');

const applicantService = require('./applicant.service');

const pool = require('../../config/db');



const logger = {

  error: (message, error) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error)

};



exports.apply = async (req, res) => {

  try {

    req.body = req.body || {};



    // 🔥 UPDATED: Added 'general_answers' to be parsed from string to JSON

    const jsonFields = ['positions', 'education', 'experience', 'skills', 'general_answers'];

    

    jsonFields.forEach(field => {

      if (req.body[field] && typeof req.body[field] === 'string') {

        try {

          // Only parse if the string isn't empty

          if (req.body[field].trim() !== "") {

            req.body[field] = JSON.parse(req.body[field]);

          } else {

            req.body[field] = []; // Default to empty array

          }

        } catch (e) {

          logger.error(`Failed to parse field: ${field}`, e);

          req.body[field] = []; 

        }

      }

    });



    // 🔥 Map employment_status to original readable values (database column is now VARCHAR(50))

    if (req.body.experience && Array.isArray(req.body.experience)) {

      req.body.experience.forEach((exp, index) => {

        if (exp.employment_status) {

          console.log(`Experience ${index}: '${exp.employment_status}' (length: ${exp.employment_status.length})`);

        }

      });

    }



    const payload = {

      ...req.body,

      cv_file_path: req.file ? req.file.path.replace(/.*[\/\\]uploads[\/\\]/, 'uploads/') : null

    };



    // Note: Make sure your 'applySchema' in applicant.validation.js 

    // now includes 'general_answers' and 'skills_description'

    const { error, value } = applySchema.validate(payload);



    if (error) {

      logger.error('Validation error:', error);

      return res.status(400).json({

        success: false,

        message: error.details[0].message

      });

    }



    const result = await applicantService.createApplicant(value);



    return res.status(201).json({

      success: true,

      message: 'Application submitted successfully',

      applicant_id: result.applicantId

    });



  } catch (err) {

    logger.error('Application submission failed:', err);

    

    // Handle duplicate email error specifically

    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {

      return res.status(409).json({

        success: false,

        message: 'Your application has already been submitted',

        error_type: 'duplicate_email'

      });

    }

    

    return res.status(500).json({

      success: false,

      message: 'Application submission failed',

      debug_error: err.message,

      error: process.env.NODE_ENV === 'development' ? err.message : undefined

    });

  }

};



exports.getAllApplicants = async (req, res) => {

  try {

    const [rows] = await pool.execute(

      `SELECT a.*, 

        GROUP_CONCAT(DISTINCT p.position_name ORDER BY ap.priority SEPARATOR ', ') as applied_positions

       FROM applicants a

       LEFT JOIN applicant_positions ap ON a.id = ap.applicant_id

       LEFT JOIN positions p ON ap.position_id = p.id

       GROUP BY a.id

       ORDER BY a.created_at DESC`

    );

    

    // Normalize CV file paths for all applicants

    const normalizedRows = rows.map(applicant => {

      if (applicant.cv_file_path) {

        applicant.cv_file_path = applicant.cv_file_path.replace(/.*[\/\\]uploads[\/\\]/, 'uploads/');

      }

      return applicant;

    });

    

    res.json(normalizedRows);

  } catch (error) {

    console.error('Error fetching applicants:', error);

    res.status(500).json({ message: "Error fetching applicants" });

  }

};



exports.getApplicantDetails = async (req, res) => {

  const { id } = req.params;

  try {

    // 1. Fetch basic info INCLUDING skills_description and gender
    const [basicRows] = await pool.execute(
      'SELECT *, skills_description, gender FROM applicants WHERE id = ?', 
      [id]
    );

    

    if (basicRows.length === 0) {

      return res.status(404).json({ message: "Applicant not found" });

    }



    const applicant = basicRows[0];



    // 2. Fetch Plural Tables (Matches your Prisma Schema)

    const [edu] = await pool.execute('SELECT * FROM educations WHERE applicant_id = ?', [id]);

    const [exp] = await pool.execute('SELECT * FROM experiences WHERE applicant_id = ?', [id]);

    

    // 3. Fetch Position Preferences with position names

    const [positionRows] = await pool.execute(

      `SELECT p.position_name, ap.priority 

       FROM applicant_positions ap

       JOIN positions p ON ap.position_id = p.id

       WHERE ap.applicant_id = ?

       ORDER BY ap.priority`,

      [id]

    );

    

    // 4. Fetch Skill Tags (if any exist in the junction table)

    const [skillRows] = await pool.execute(

      `SELECT s.name 

       FROM skills s 

       JOIN applicant_skills ask ON s.id = ask.skill_id 

       WHERE ask.applicant_id = ?`, 

      [id]

    );

    // 5. Fetch General Applicant Answers with Questions

    const [generalAnswerRows] = await pool.execute(

      `SELECT gq.question, gaa.answer 

       FROM general_applicant_answers gaa

       JOIN general_questions gq ON gaa.gaid = gq.id

       WHERE gaa.applicant_id = ?

       ORDER BY gq.id`,

      [id]

    );



    // 4. Normalize CV file path if it exists

    if (applicant.cv_file_path) {

      applicant.cv_file_path = applicant.cv_file_path.replace(/.*[\/\\]uploads[\/\\]/, 'uploads/');

    }



    // 5. Return the data structure exactly as the frontend expects

    res.json({

      ...applicant,

      education: edu,

      experience: exp,

      positions: positionRows,

      // We provide both: the text description and the tags array

      skills: skillRows.map(s => s.name),

      skills_description: applicant.skills_description,

      general_answers: generalAnswerRows

    });



  } catch (error) {

    console.error("DETAILED ERROR:", error.message); 

    res.status(500).json({ message: "Error fetching details", error: error.message });

  }

};