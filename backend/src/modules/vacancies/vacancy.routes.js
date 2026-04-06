const express = require('express');
const router = express.Router();
const controller = require('./vacancy.controller');

// Get all vacancies
router.get('/', controller.getAllVacancies);

// Sync vacancies from external source
router.post('/sync', controller.syncVacancies);

// Get single vacancy by ID
router.get('/:id', controller.getVacancyById);

module.exports = router;
