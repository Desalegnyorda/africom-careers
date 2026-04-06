/**
 * Add education background
 * @param {Object} connection - Database connection
 * @param {string} applicantId - UUID of the applicant
 * @param {Object} education - Education data object
 */
exports.addEducation = async (connection, applicantId, education) => {
  if (!education) return;

  const sql = `
    INSERT INTO educations (
      id,
      applicant_id,
      institution,
      education_level,
      field_of_study,
      graduation_year
    ) VALUES (UUID(), ?, ?, ?, ?, ?)
  `;

  await connection.execute(sql, [
    applicantId,
    education.institution,
    education.education_level,
    education.field_of_study,
    education.graduation_year
  ]);
};