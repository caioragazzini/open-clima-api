const express = require('express');
require('./auth/jwt');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./docs.js');


const usersRouter = require('./users');
const weatherRouter = require('./weather');
const statusRouter = require('./status');
const authRouter = require('./auth'); 

const router = express.Router(); 


router.use('/status', statusRouter);
router.use('/users', usersRouter);
router.use('/weather', weatherRouter);
router.use('/auth', authRouter); 


router.use('/docs', swaggerUi.serve);
router.use('/docs', swaggerUi.setup(swaggerConfig));

module.exports = router;