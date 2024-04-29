const express = require('express');

const userRouter = require('./users');
const authRouter = require('./auth');
const dailyBoxOfficeList = require('./BoxOffice');
const comments = require('./comment');

const router = express.Router();

router.use('/user', userRouter);
router.use('/auths', authRouter);
router.use('/comments', comments);
router.use('/Boxoffice', dailyBoxOfficeList);

module.exports = router;
