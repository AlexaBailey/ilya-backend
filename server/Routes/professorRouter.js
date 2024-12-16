const professorRouter=require('express').Router();
const professorController=require('../controllers/professorController');

professorRouter.get('/', professorController.getAll);
professorRouter.get('/:id', professorController.getById);
professorRouter.post('/', professorController.create);
professorRouter.delete('/:id', professorController.delete);
professorRouter.put('/:id', professorController.put);
professorRouter.delete("/:id/schedule/:scheduleId", professorController.deleteSchedule);
professorRouter.delete('/:id/evaluation/:evaluationId', professorController.deleteEvaluation);
professorRouter.delete('/:id/subject/:subjectId', professorController.deleteSubject);
professorRouter.post('/:id/subject/:subjectId', professorController.addProfessorSubject);
professorRouter.get('/:id/download', professorController.getFileById);

module.exports = professorRouter;