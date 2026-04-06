/**
 * Add work experiences for an applicant
 * @param {Object} connection - Database connection
 * @param {string} applicantId - UUID of the applicant
 * @param {Object} experience - Experience data object
 */
exports.addExperience = async (connection, applicantId, experience) => {
  const sql = `
    INSERT INTO experiences (
      id,
      applicant_id,
      company_name,
      company_address,
      position,
      employment_status,
      date_from,
      date_to
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
  `;

  await connection.execute(sql, [
    applicantId,
    experience.company_name,
    experience.company_address, 
    experience.position,
    experience.employment_status, 
    experience.date_from,
    experience.date_to || null 
  ]);
};