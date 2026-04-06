const express = require('express');



const cors = require('cors');



const helmet = require('helmet');



require('dotenv').config();







// Routes



const applicantRoutes = require('./modules/applicants/applicant.routes');



const authRoutes = require('./modules/auth/auth.routes');



const positionRoutes = require('./modules/positions/position.routes');



const vacancyRoutes = require('./modules/vacancies/vacancy.routes');







// Middlewares



const errorMiddleware = require('./middlewares/error.middleware');







const app = express();







/**



 * Global Middlewares



 */



app.use(helmet());



app.use(cors());



app.use(express.json());



app.use(express.urlencoded({ extended: true }));







// Serve static files from uploads directory



app.use('/uploads', express.static('uploads'));







/**



 * Health Check



 */



app.get('/', (req, res) => {



  res.json({



    status: 'OK',



    message: 'Africom Careers API is running'



  });



});







/**



 * API Routes



 */



app.use('/api/applicants', applicantRoutes);



app.use('/api/auth', authRoutes);



app.use('/api/positions', positionRoutes);



app.use('/api/vacancies', vacancyRoutes);







/**



 * Global Error Handler (MUST be last)



 */



app.use(errorMiddleware);







module.exports = app;



