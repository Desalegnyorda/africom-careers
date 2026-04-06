const pool = require('../../config/db');
const emailService = require('../../services/email.service');

/**
 * Update applicant status
 * Valid statuses: submitted, under_review, shortlisted, rejected, hired, talent_pool
 */
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['submitted', 'under_review', 'shortlisted', 'rejected', 'hired', 'talent_pool'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: submitted, under_review, shortlisted, rejected, hired, or talent_pool'
      });
    }

    // Check if applicant exists and get their details for email
    const [applicant] = await pool.execute(
      'SELECT id, first_name, last_name, email FROM applicants WHERE id = ?',
      [id]
    );

    if (applicant.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }

    const applicantData = applicant[0];

    // Update status
    await pool.execute(
      'UPDATE applicants SET application_status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    // Log the status change (optional but recommended)
    await pool.execute(
      'INSERT INTO audit_logs (action_type, table_name, record_id, performed_by) VALUES (?, ?, ?, ?)',
      ['UPDATE', 'applicants', id, req.user?.id || 'admin']
    );

    // Send email notification for status change (only for meaningful status updates, exclude talent_pool)
    let emailResult = null;
    if (status !== 'submitted' && status !== 'talent_pool') {
      try {
        emailResult = await emailService.sendStatusUpdateEmail(
          applicantData.email, 
          status, 
          applicantData
        );
        console.log(`Email notification result for ${applicantData.email}:`, emailResult);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the status update if email fails
        emailResult = { success: false, error: emailError.message };
      }
    }

    // Prepare response (only include email info if email was actually attempted)
    const response = {
      success: true,
      message: `Applicant status updated to ${status}`,
      newStatus: status
    };

    if (emailResult !== null) {
      response.emailSent = emailResult.success;
      response.emailMessage = emailResult.message || null;
    }

    return res.json(response);

  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update applicant status',
      error: error.message
    });
  }
};

/**
 * Bulk update multiple applicants' status
 */
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { applicantIds, status } = req.body;

    // Validate inputs
    if (!Array.isArray(applicantIds) || applicantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Applicant IDs array is required'
      });
    }

    const validStatuses = ['submitted', 'under_review', 'shortlisted', 'rejected', 'hired', 'talent_pool'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: submitted, under_review, shortlisted, rejected, hired, or talent_pool'
      });
    }

    // Create placeholders for IN clause
    const placeholders = applicantIds.map(() => '?').join(',');

    // Update multiple applicants
    await pool.execute(
      `UPDATE applicants SET application_status = ?, updated_at = NOW() WHERE id IN (${placeholders})`,
      [status, ...applicantIds]
    );

    // Log bulk update
    for (const applicantId of applicantIds) {
      await pool.execute(
        'INSERT INTO audit_logs (action_type, table_name, record_id, performed_by) VALUES (?, ?, ?, ?)',
        ['UPDATE', 'applicants', applicantId, req.user?.id || 'admin']
      );
    }

    return res.json({
      success: true,
      message: `${applicantIds.length} applicants updated to ${status}`,
      updatedCount: applicantIds.length
    });

  } catch (error) {
    console.error('Bulk status update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update applicant statuses',
      error: error.message
    });
  }
};

/**
 * Get applicants by status
 */
exports.getApplicantsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ['submitted', 'under_review', 'shortlisted', 'rejected', 'hired', 'talent_pool'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM applicants WHERE application_status = ? ORDER BY created_at DESC',
      [status]
    );

    // Normalize CV file paths
    const normalizedRows = rows.map(applicant => {
      if (applicant.cv_file_path) {
        applicant.cv_file_path = applicant.cv_file_path.replace(/.*[\/\\]uploads[\/\\]/, 'uploads/');
      }
      return applicant;
    });

    res.json({
      success: true,
      applicants: normalizedRows,
      status: status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applicants by status',
      error: error.message
    });
  }
};
