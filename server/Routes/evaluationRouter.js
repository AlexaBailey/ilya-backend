const evaluationRouter = require("express").Router();
const evaluationController = require("../Controllers/evaluationController");

evaluationRouter.get("/:id", evaluationController.getById);
evaluationRouter.post('/:id',evaluationController.saveEvaluationResults);
evaluationRouter.get('/:id/download', evaluationController.getFileById);

module.exports = evaluationRouter;