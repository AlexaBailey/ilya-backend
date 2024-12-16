const router = require("express").Router();
const professorRouter = require('./professorRouter');
const studentRouter = require("./studentRouter");
const subjectRouter = require("./subjectRouter");
const groupRouter = require("./groupRouter");
const evaluationRouter = require("./evaluationRouter");

router.use('/professor',professorRouter);
router.use('/student',studentRouter);
router.use('/subject',subjectRouter);
router.use('/group', groupRouter);
router.use('/evaluation', evaluationRouter);


module.exports = router;