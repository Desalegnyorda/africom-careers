const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db'); // Correct path to config folder

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the admin
        const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const admin = rows[0];

        // 2. Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 3. Create Token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || 'your_secret_key', // Make sure this is in your .env
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get current admin info
exports.getProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const [rows] = await pool.execute('SELECT id, email FROM admin WHERE id = ?', [adminId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, admin: rows[0] });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { email, currentPassword, newPassword } = req.body;

        // Get current admin data
        const [adminRows] = await pool.execute('SELECT * FROM admin WHERE id = ?', [adminId]);
        
        if (adminRows.length === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const admin = adminRows[0];
        let updateFields = [];
        let updateValues = [];

        // Check if email is being updated and verify it's not already taken
        if (email && email !== admin.email) {
            const [existingEmail] = await pool.execute('SELECT id FROM admin WHERE email = ? AND id != ?', [email, adminId]);
            if (existingEmail.length > 0) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
            updateFields.push('email = ?');
            updateValues.push(email);
        }

        // Check if password is being updated
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: "Current password is required to update password" });
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ success: false, message: "Current password is incorrect" });
            }

            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedNewPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        // Update admin
        updateValues.push(adminId);
        const [result] = await pool.execute(
            `UPDATE admin SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to update profile" });
        }

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};