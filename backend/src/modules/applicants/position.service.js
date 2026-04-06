/**

 * Add position preferences

 * @param {Object} connection - Database connection

 * @param {string} applicantId - UUID of the applicant

 * @param {Array} positions - Array of {position_id, priority}

 */

exports.addApplicantPositions = async (connection, applicantId, positions) => {

  if (!Array.isArray(positions)) return;



  if (positions.length > 3) {

    throw new Error('Maximum of 3 position priorities allowed');

  }



  for (const pos of positions) {

    await connection.execute(

      `

      INSERT INTO applicant_positions (

        id,

        applicant_id,

        position_id,

        priority

      ) VALUES (UUID(), ?, ?, ?)

      `,

      [applicantId, pos.position_id, pos.priority.toString()] // Cast priority to string for ENUM

    );

  }

};