const express = require('express');



const router = express.Router();



const controller = require('./applicant.controller');

const statusController = require('./status.controller');



const upload = require('../../config/multer');







// Apply with CV upload



router.post(



  '/apply',



  upload.single('cv'), // 👈 field name must match frontend



  controller.apply



);







// Get all applicants for admin dashboard



router.get('/all', controller.getAllApplicants);







// Get specific applicant details



router.get('/:id', controller.getApplicantDetails);







// Update applicant status



router.put('/:id/status', statusController.updateApplicantStatus);







module.exports = router;



