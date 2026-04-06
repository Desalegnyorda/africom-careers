const pool = require('../../config/db');

exports.getAllPositions = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, position_name, department 
       FROM positions 
       ORDER BY position_name`
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: "Error fetching positions" });
  }
};

exports.getPositionsWithApplicantCount = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        p.id, 
        p.position_name, 
        p.department,
        COUNT(ap.applicant_id) as applicant_count
       FROM positions p
       LEFT JOIN applicant_positions ap ON p.id = ap.position_id
       GROUP BY p.id, p.position_name, p.department
       ORDER BY p.position_name`
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching positions with counts:', error);
    res.status(500).json({ message: "Error fetching positions with counts" });
  }
};
