const pool = require('../../config/db');
const educationService = require('./education.service');
const experienceService = require('./experience.service');
const skillService = require('./skill.service');
const positionService = require('./position.service');

exports.createApplicant = async (data) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Insert Main Applicant
    await connection.execute(
      `INSERT INTO applicants (
        id, first_name, last_name, gender, email, phone, 
        address, country, city, cv_file_path, skills_description
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.first_name, data.last_name, data.gender, data.email, data.phone,
        data.address ?? null, data.country ?? null, data.city ?? null, data.cv_file_path ?? null,
        data.skills_description ?? null
      ]
    );

    // ✅ UUID SAFE FETCH
    const [rows] = await connection.execute(
      `SELECT id FROM applicants WHERE email = ?`,
      [data.email]
    );

    if (!rows.length) throw new Error('Failed to retrieve applicant ID');
    const applicantId = rows[0].id;

    // 2️⃣ Education (Matches paper design columns)
    if (data.education?.length > 0) {
      for (const edu of data.education) {
        await educationService.addEducation(connection, applicantId, edu);
      }
    }

    // 3️⃣ Experience
    if (data.experience?.length > 0) {
      for (const exp of data.experience) {
        await experienceService.addExperience(connection, applicantId, exp);
      }
    }

    // 4️⃣ Skills (Link table)
    if (data.skills?.length > 0) {
      await skillService.addSkills(connection, applicantId, data.skills);
    }

    // 5️⃣ Positions + Priorities
    if (data.positions?.length > 0) {
      await positionService.addApplicantPositions(connection, applicantId, data.positions);
    }

    // 6️⃣ Vacancy Link
    if (data.vacancy_id) {
      await connection.execute(
        `INSERT INTO applicant_vacancies (id, applicant_id, vacancy_id) VALUES (UUID(), ?, ?)`,
        [applicantId, data.vacancy_id]
      );
    }

    // 7️⃣ General Answers (if table exists)
    if (data.general_answers?.length > 0) {
      for (const answer of data.general_answers) {
        try {
          await connection.execute(
            `INSERT INTO general_answers (id, applicant_id, question_id, answer_text) VALUES (UUID(), ?, ?, ?)`,
            [applicantId, answer.question_id, answer.answer_text]
          );
        } catch (err) {
          // If table doesn't exist, log but don't fail the entire transaction
          console.warn('General answers table might not exist:', err.message);
        }
      }
    }

    await connection.commit();
    return { success: true, applicantId };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};