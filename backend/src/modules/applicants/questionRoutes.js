const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your database connection

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, question FROM general_questions');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

module.exports = router;