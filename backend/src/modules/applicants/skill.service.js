/**
 * Add skills for an applicant (Link Table)
 * @param {Object} connection - Database connection
 * @param {string} applicantId - UUID of the applicant
 * @param {Array<string>} skills - Array of skill UUIDs
 */
exports.addSkills = async (connection, applicantId, skills) => {
  if (!Array.isArray(skills)) return;

  for (const skillId of skills) {
    await connection.execute(
      `
      INSERT INTO applicant_skills (
        id,
        applicant_id,
        skill_id
      ) VALUES (UUID(), ?, ?)
      `,
      [applicantId, skillId]
    );
  }
};