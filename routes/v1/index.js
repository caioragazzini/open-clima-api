const express = require('express');
require('./auth/jwt');


const authRouter = require('./auth');


const router = express.Router();


router.use('/auth', authRouter);



module.exports = router;
