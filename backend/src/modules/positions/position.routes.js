const express = require('express');
const router = express.Router();
const controller = require('./position.controller');

// Get all positions
router.get('/', controller.getAllPositions);

// Get positions with applicant counts
router.get('/with-counts', controller.getPositionsWithApplicantCount);

module.exports = router;
